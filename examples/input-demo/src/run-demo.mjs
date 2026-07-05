import { planInputEnvelope, createMockOcrAdapter, createMockSpeechAdapter, textInput } from "@pactscene/input";
import orderScene from "../../../spec/examples/scenes/demo.order.query.json" with { type: "json" };
import leadScene from "../../../spec/examples/scenes/demo.lead.create.json" with { type: "json" };
import incidentScene from "../../../spec/examples/scenes/demo.incident.query.json" with { type: "json" };
import orderContract from "../../../spec/examples/contracts/demo.order.query.contract.json" with { type: "json" };
import leadContract from "../../../spec/examples/contracts/demo.lead.create.contract.json" with { type: "json" };
import incidentContract from "../../../spec/examples/contracts/demo.incident.query.contract.json" with { type: "json" };
import graph from "../../../spec/examples/graphs/demo-scene-graph.json" with { type: "json" };

const scenes = [orderScene, leadScene, incidentScene];
const contracts = [orderContract, leadContract, incidentContract];

const ocr = createMockOcrAdapter({
  defaultText: "show open orders this month"
});
const speech = createMockSpeechAdapter({
  defaultText: "find critical incidents"
});

const inputs = [
  textInput("create a software lead for Acme Labs"),
  await ocr.recognize({ sourceUri: "mock://order-screenshot" }),
  await speech.transcribe({ sourceUri: "mock://incident-audio", languageHint: "en" })
];

for (const input of inputs) {
  const response = planInputEnvelope(input, scenes, contracts, graph);
  const card = response.cards[0];
  console.log(
    JSON.stringify(
      {
        inputKind: input.kind,
        inputText: input.text,
        sceneCode: card?.sceneCode,
        parser: card?.metadata.parser,
        graphVersion: card?.metadata.graphVersion,
        matchedRules: card?.metadata.matchedRules
      },
      null,
      2
    )
  );
}

