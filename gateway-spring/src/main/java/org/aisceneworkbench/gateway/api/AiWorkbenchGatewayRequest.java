package org.aisceneworkbench.gateway.api;

import jakarta.validation.constraints.NotBlank;

public record AiWorkbenchGatewayRequest(
    String sessionId,
    @NotBlank String message
) {
}

