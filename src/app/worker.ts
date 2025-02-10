import {
  pipeline,
  env,
  PipelineType,
  Pipeline,
} from "@huggingface/transformers";

env.allowLocalModels = false;

class PipelineSingleton {
  static task: PipelineType = "text-classification";
  static model = "Xenova/distilbert-base-uncased-finetuned-sst-2-english";
  static instance: Pipeline | null = null;

  static async getInstance(progress_callback?: (progress) => void) {
    if (this.instance === null) {
      this.instance = (await pipeline(this.task, this.model, {
        progress_callback,
      })) as Pipeline;
    }
    return this.instance;
  }
}
self.addEventListener("message", async (event) => {
  const classifier = await PipelineSingleton.getInstance((x) => {
    self.postMessage(x);
  });

  const output = await classifier(event.data.text);

  self.postMessage({ status: "complete", output });
});
