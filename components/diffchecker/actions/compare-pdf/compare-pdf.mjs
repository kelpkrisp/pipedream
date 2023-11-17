import diffchecker from "../../diffchecker.app.mjs";

export default {
  key: "diffchecker-compare-pdf",
  name: "Compare PDFs",
  description: "Compares two PDFs and returns the result. [See the documentation](https://www.diffchecker.com/public-api/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    diffchecker,
    leftPdf: {
      type: "string",
      label: "Left PDF",
      description: "The base64 encoded content or URL of the left PDF file you want to diff.",
    },
    rightPdf: {
      type: "string",
      label: "Right PDF",
      description: "The base64 encoded content or URL of the right PDF file you want to diff.",
    },
    outputType: {
      propDefinition: [
        diffchecker,
        "outputType",
      ],
    },
    diffLevel: {
      propDefinition: [
        diffchecker,
        "diffLevel",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.diffchecker.comparePdfs({
      leftPdf: this.leftPdf,
      rightPdf: this.rightPdf,
      outputType: this.outputType,
      diffLevel: this.diffLevel,
    });

    $.export("$summary", "Compared PDFs successfully");
    return response;
  },
};