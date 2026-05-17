package com.studentos.server.config;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.util.StringUtils;

public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    private static final String PROPERTY_SOURCE_NAME = "databaseUrlProperties";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String datasourceUrl = environment.getProperty("spring.datasource.url");
        String databaseUrl = environment.getProperty("DATABASE_URL");
        String rawUrl = hasResolvedText(datasourceUrl) ? datasourceUrl : databaseUrl;

        if (!StringUtils.hasText(rawUrl)) {
            if (environment.matchesProfiles("prod")) {
                throw new IllegalStateException(
                        "Production database URL is missing. Set DATABASE_URL or SPRING_DATASOURCE_URL on the backend service.");
            }
            return;
        }

        if (rawUrl.startsWith("jdbc:")) {
            return;
        }

        if (!rawUrl.startsWith("postgres://") && !rawUrl.startsWith("postgresql://")) {
            if (environment.matchesProfiles("prod")) {
                throw new IllegalStateException(
                        "Production database URL must start with jdbc:postgresql://, postgres://, or postgresql://.");
            }
            return;
        }

        URI uri = URI.create(rawUrl.replaceFirst("^postgres://", "postgresql://"));
        Map<String, Object> properties = new LinkedHashMap<>();
        properties.put("spring.datasource.url", toJdbcUrl(uri));

        String userInfo = uri.getRawUserInfo();
        if (StringUtils.hasText(userInfo)) {
            String[] credentials = userInfo.split(":", 2);
            if (!StringUtils.hasText(environment.getProperty("spring.datasource.username"))) {
                properties.put("spring.datasource.username", decode(credentials[0]));
            }
            if (credentials.length > 1 && !StringUtils.hasText(environment.getProperty("spring.datasource.password"))) {
                properties.put("spring.datasource.password", decode(credentials[1]));
            }
        }

        if (!environment.getPropertySources().contains(PROPERTY_SOURCE_NAME)) {
            environment.getPropertySources().addFirst(new MapPropertySource(PROPERTY_SOURCE_NAME, properties));
        }
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 10;
    }

    private static String toJdbcUrl(URI uri) {
        StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://");
        jdbcUrl.append(uri.getHost());
        if (uri.getPort() != -1) {
            jdbcUrl.append(':').append(uri.getPort());
        }
        if (StringUtils.hasText(uri.getRawPath())) {
            jdbcUrl.append(uri.getRawPath());
        }
        String query = withSupabaseDefaults(uri, uri.getRawQuery());
        if (StringUtils.hasText(query)) {
            jdbcUrl.append('?').append(query);
        }
        return jdbcUrl.toString();
    }

    private static String withSupabaseDefaults(URI uri, String rawQuery) {
        String host = uri.getHost();
        if (!StringUtils.hasText(host) || !host.endsWith("supabase.com")) {
            return rawQuery;
        }

        String query = appendQueryParameterIfMissing(rawQuery, "sslmode", "require");
        if (host.endsWith(".pooler.supabase.com") && uri.getPort() == 6543) {
            query = appendQueryParameterIfMissing(query, "prepareThreshold", "0");
        }
        return query;
    }

    private static String appendQueryParameterIfMissing(String rawQuery, String name, String value) {
        if (StringUtils.hasText(rawQuery)) {
            for (String parameter : rawQuery.split("&")) {
                if (parameter.equals(name) || parameter.startsWith(name + "=")) {
                    return rawQuery;
                }
            }
            return rawQuery + "&" + name + "=" + value;
        }
        return name + "=" + value;
    }

    private static String decode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }

    private static boolean hasResolvedText(String value) {
        return StringUtils.hasText(value) && !value.startsWith("${");
    }
}
