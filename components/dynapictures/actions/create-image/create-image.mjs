import dynapictures from "../../dynapictures.app.mjs"
import { axios } from "@pipedream/platform"

export default {
  key: "dynapictures-create-image",
  name: "Create Image",
  description: "Generates a new image using a template. [See the documentation](https://dynapictures.com/docs/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    dynapictures,
    templateId: {
      propDefinition: [
        dynapictures,
        "templateId",
      ],
    },
    imageParams: {
      propDefinition: [
        dynapictures,
        "imageParams",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dynapictures.generateImage({
      templateId: this.templateId,
      imageParams: this.imageParams.map(JSON.parse),
    });

    $.export("$summary", `Successfully generated image with template ID ${this.templateId}`);
    return response;
  },
};