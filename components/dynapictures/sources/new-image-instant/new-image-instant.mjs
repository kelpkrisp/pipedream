import dynapictures from "../../dynapictures.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dynapictures-new-image-instant",
  name: "New Image (Instant)",
  description: "Emits an event when a new image has been generated. [See the documentation](https://api.dynapictures.com)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    dynapictures,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // Fetch the last 50 events (if available) and emit them
      // Since this source does not require any input, we skip this step
    },
    async activate() {
      // Construct the target URL for webhook
      const targetUrl = this.http.endpoint;

      // Subscribe to the webhook
      const webhook = await this.dynapictures.subscribeWebhook({
        targetUrl,
        eventType: this.dynapictures.propDefinitions.eventType.default,
      });

      // Store the webhook ID in the component's state
      this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      // Get the stored webhook ID
      const webhookId = this.db.get("webhookId");

      // Unsubscribe from the webhook
      await this.dynapictures.unsubscribeWebhook({
        webhookId,
      });
    },
  },
  async run(event) {
    const signature = event.headers['x-dynapictures-signature'];
    const computedSignature = this.dynapictures.computeSignature(event.body);
    if (signature !== computedSignature) {
      this.http.respond({
        status: 401,
        body: "Signature mismatch",
      });
      return;
    }

    this.http.respond({
      status: 200,
      body: "Webhook received",
    });

    // Emit the event with the image data
    this.$emit(event.body, {
      id: event.body.id,
      summary: "New image generated",
      ts: Date.parse(event.body.created_at),
    });
  },
};