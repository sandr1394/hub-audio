package web.hub.audio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import web.hub.audio.dao.entity.five9.Five9Call;
import web.hub.audio.dao.entity.interactions.InteractionsCall;
import web.hub.audio.dao.specification.SpecificationBuilder;

@Configuration
public class SpecificationBuilderConfig {

    @Bean
    public SpecificationBuilder<InteractionsCall> getInteractionsSpecificationBuilder(){
        return new SpecificationBuilder<>();
    }

    @Bean
    public SpecificationBuilder<Five9Call> getFive9SpecificationBuilder(){
        return new SpecificationBuilder<>();
    }
}
