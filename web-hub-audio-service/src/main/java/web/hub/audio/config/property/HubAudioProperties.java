package web.hub.audio.config.property;

import com.prosper.platform.springboot.config.property.PlatformJdbcProperties;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.NestedConfigurationProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;

@Getter
@Setter
@ToString
@Validated
@Configuration
@ConfigurationProperties(prefix = HubAudioProperties.PREFIX)
public class HubAudioProperties implements InitializingBean {

    private final static Logger LOGGER = LoggerFactory.getLogger(HubAudioProperties.class);
    static final String PREFIX = "hub-audio-service";

    @Valid
    @NestedConfigurationProperty
    private DatabaseProperties databases;

    @Getter
    @Setter
    @ToString
    @Validated
    public static class DatabaseProperties {
        @Valid
        @NestedConfigurationProperty
        private PlatformJdbcProperties audioLog;
    }

    @Override
    public void afterPropertiesSet() {
        LOGGER.info(this.toString());
    }
}
