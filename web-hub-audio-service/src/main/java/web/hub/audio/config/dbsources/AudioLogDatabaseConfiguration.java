package web.hub.audio.config.dbsources;

import com.prosper.platform.springboot.util.PlatformJdbcUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.util.ClassUtils;
import web.hub.audio.config.property.HubAudioProperties;
import web.hub.audio.dao.entity.WebHubAudioEntityMarker;
import web.hub.audio.dao.repository.WebHubAudioRepositoryMarker;

import javax.sql.DataSource;

@Configuration
@EnableJpaRepositories(
        basePackageClasses = {WebHubAudioRepositoryMarker.class, WebHubAudioEntityMarker.class},
        entityManagerFactoryRef = "auditLogEntityManagerFactory", // refers to the bean name below
        transactionManagerRef = AudioLogDatabaseConfiguration.AUDIT_LOG_MANAGER_NAME // also refers to the bean name below
)
public class AudioLogDatabaseConfiguration {

    public static final String AUDIT_LOG_MANAGER_NAME = "auditLogTransactionManager";

    @Autowired
    private HubAudioProperties hubAudioProperties;

    @Bean
    @Primary
    public JpaVendorAdapter auditLogJpaVendorAdapter() {
        return PlatformJdbcUtil.createJpaVendorAdapter(hubAudioProperties.getDatabases().getAudioLog());
    }

    @Bean
    @Primary
    public LocalContainerEntityManagerFactoryBean auditLogEntityManagerFactory() {
        return PlatformJdbcUtil.createEntityManagerFactoryBean(
                hubAudioProperties.getDatabases().getAudioLog(),
                auditLogDataSource(),
                auditLogJpaVendorAdapter(),
                ClassUtils.getPackageName(WebHubAudioRepositoryMarker.class),
                ClassUtils.getPackageName(WebHubAudioEntityMarker.class));
    }

    @Bean
    @Primary
    public DataSource auditLogDataSource() {
        return PlatformJdbcUtil.createDataSource(hubAudioProperties.getDatabases().getAudioLog());
    }

    @Bean
    @Primary
    @Qualifier(AUDIT_LOG_MANAGER_NAME)
    public PlatformTransactionManager auditLogTransactionManager() {
        LocalContainerEntityManagerFactoryBean bean = auditLogEntityManagerFactory();
        return PlatformJdbcUtil.createTransactionManager(bean);
    }
}
