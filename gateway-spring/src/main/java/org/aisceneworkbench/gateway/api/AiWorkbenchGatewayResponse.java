package org.aisceneworkbench.gateway.api;

import java.util.List;
import java.util.Map;

public record AiWorkbenchGatewayResponse(
    String reply,
    List<Map<String, Object>> cards,
    List<String> suggestions
) {
}

