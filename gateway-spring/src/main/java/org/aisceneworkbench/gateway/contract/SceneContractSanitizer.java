package org.aisceneworkbench.gateway.contract;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

public class SceneContractSanitizer {
    private static final Map<String, Set<String>> ALLOWED_FIELDS = Map.of(
        "demo.order.query", Set.of("status", "startDate", "endDate", "minAmount", "region", "archived"),
        "demo.incident.query", Set.of("severity", "status", "owner"),
        "demo.lead.create", Set.of("company", "industry", "priority", "notes")
    );

    public Map<String, Object> sanitize(String sceneCode, Map<String, Object> source) {
        Set<String> allowed = ALLOWED_FIELDS.get(sceneCode);
        if (allowed == null || allowed.isEmpty()) {
            return Map.of();
        }
        Map<String, Object> sanitized = new LinkedHashMap<>();
        for (Map.Entry<String, Object> entry : source.entrySet()) {
            if (allowed.contains(entry.getKey()) && entry.getValue() != null) {
                sanitized.put(entry.getKey(), entry.getValue());
            }
        }
        return sanitized;
    }
}
