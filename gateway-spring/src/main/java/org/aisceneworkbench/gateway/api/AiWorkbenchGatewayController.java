package org.aisceneworkbench.gateway.api;

import jakarta.validation.Valid;
import org.aisceneworkbench.gateway.app.AiDispatchService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai/workbench")
public class AiWorkbenchGatewayController {
    private final AiDispatchService dispatchService;

    public AiWorkbenchGatewayController(AiDispatchService dispatchService) {
        this.dispatchService = dispatchService;
    }

    @PostMapping("/chat")
    public AiWorkbenchGatewayResponse chat(@Valid @RequestBody AiWorkbenchGatewayRequest request) {
        return dispatchService.chat(request);
    }
}

