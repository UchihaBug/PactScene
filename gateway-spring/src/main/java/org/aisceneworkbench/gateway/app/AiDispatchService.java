package org.aisceneworkbench.gateway.app;

import org.aisceneworkbench.gateway.api.AiWorkbenchGatewayRequest;
import org.aisceneworkbench.gateway.api.AiWorkbenchGatewayResponse;
import org.aisceneworkbench.gateway.contract.SceneContractSanitizer;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiDispatchService {
    private final SceneContractSanitizer sanitizer = new SceneContractSanitizer();

    public AiWorkbenchGatewayResponse chat(AiWorkbenchGatewayRequest request) {
        String message = request.message().toLowerCase();
        if (message.contains("order") || message.contains("subscription") || message.contains("shipment")) {
            return orderQuery(message);
        }
        if (message.contains("incident") || message.contains("alert") || message.contains("outage")) {
            return incidentQuery(message);
        }
        if (message.contains("lead") || message.contains("prospect") || message.contains("opportunity")) {
            return leadCreate(message);
        }
        return new AiWorkbenchGatewayResponse(
            "No registered scene matched this request.",
            List.of(),
            List.of("show open orders this month", "create a software lead for Acme Labs", "find critical incidents")
        );
    }

    private AiWorkbenchGatewayResponse orderQuery(String message) {
        Map<String, Object> raw = new LinkedHashMap<>();
        if (message.contains("open") || message.contains("active")) {
            raw.put("status", "open");
        }
        if (message.contains("processing")) {
            raw.put("status", "processing");
        }
        if (message.contains("shipped")) {
            raw.put("status", "shipped");
        }
        if (message.contains("north")) {
            raw.put("region", "north");
        }
        if (message.contains("this month")) {
            LocalDate now = LocalDate.now();
            raw.put("startDate", now.withDayOfMonth(1).toString());
            raw.put("endDate", now.withDayOfMonth(now.lengthOfMonth()).toString());
        }
        raw.put("archived", false);
        Map<String, Object> prefill = sanitizer.sanitize("demo.order.query", raw);
        return new AiWorkbenchGatewayResponse(
            "Matched Orders.",
            List.of(queryCard("demo.order.query", "order_query", prefill, "1.0.0")),
            List.of("show open orders this month", "find shipped orders above 5000")
        );
    }

    private AiWorkbenchGatewayResponse incidentQuery(String message) {
        Map<String, Object> raw = new LinkedHashMap<>();
        if (message.contains("critical") || message.contains("severe")) {
            raw.put("severity", "critical");
        }
        if (message.contains("open")) {
            raw.put("status", "open");
        }
        Map<String, Object> prefill = sanitizer.sanitize("demo.incident.query", raw);
        return new AiWorkbenchGatewayResponse(
            "Matched Incidents.",
            List.of(queryCard("demo.incident.query", "incident_query", prefill, "1.0.0")),
            List.of("find critical incidents", "show open incidents assigned to me")
        );
    }

    private AiWorkbenchGatewayResponse leadCreate(String message) {
        Map<String, Object> raw = new LinkedHashMap<>();
        if (message.contains("software")) {
            raw.put("industry", "software");
        }
        raw.put("priority", message.contains("high priority") ? "high" : "normal");
        raw.put("notes", message);
        Map<String, Object> draft = sanitizer.sanitize("demo.lead.create", raw);
        Map<String, Object> card = new LinkedHashMap<>();
        card.put("type", "scene_form");
        card.put("sceneCode", "demo.lead.create");
        card.put("draft", draft);
        card.put("missingFields", List.of("company"));
        card.put("metadata", metadata("create", "embed_form", "lead_create", "1.0.0"));
        return new AiWorkbenchGatewayResponse("Matched Sales lead.", List.of(card), List.of("create a software lead for Acme Labs"));
    }

    private Map<String, Object> queryCard(String sceneCode, String intent, Map<String, Object> prefill, String version) {
        Map<String, Object> card = new LinkedHashMap<>();
        card.put("type", "query_dispatch");
        card.put("sceneCode", sceneCode);
        card.put("prefill", prefill);
        card.put("metadata", metadata("query", "embed_query", intent, version));
        return card;
    }

    private Map<String, Object> metadata(String sceneType, String mode, String intent, String version) {
        Map<String, Object> metadata = new LinkedHashMap<>();
        metadata.put("sceneType", sceneType);
        metadata.put("mode", mode);
        metadata.put("intent", intent);
        metadata.put("parser", "demo-rule");
        metadata.put("contractMode", "scene_contract");
        metadata.put("contractVersion", version);
        return metadata;
    }
}
