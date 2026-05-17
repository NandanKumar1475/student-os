package com.studentos.server.config;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.boot.SpringApplication;
import org.springframework.mock.env.MockEnvironment;

class DatabaseUrlEnvironmentPostProcessorTests {

    private final DatabaseUrlEnvironmentPostProcessor processor = new DatabaseUrlEnvironmentPostProcessor();

    @Test
    void convertsRenderPostgresUrlToJdbcProperties() {
        MockEnvironment environment = new MockEnvironment()
                .withProperty("DATABASE_URL", "postgres://student_os_user:secret%40pass@host.example.com:5432/student_os?sslmode=require");

        processor.postProcessEnvironment(environment, new SpringApplication());

        assertThat(environment.getProperty("spring.datasource.url"))
                .isEqualTo("jdbc:postgresql://host.example.com:5432/student_os?sslmode=require");
        assertThat(environment.getProperty("spring.datasource.username")).isEqualTo("student_os_user");
        assertThat(environment.getProperty("spring.datasource.password")).isEqualTo("secret@pass");
    }

    @Test
    void leavesJdbcUrlUntouched() {
        MockEnvironment environment = new MockEnvironment()
                .withProperty("DATABASE_URL", "jdbc:postgresql://host.example.com:5432/student_os");

        processor.postProcessEnvironment(environment, new SpringApplication());

        assertThat(environment.getProperty("spring.datasource.url")).isNull();
        assertThat(environment.getProperty("DATABASE_URL"))
                .isEqualTo("jdbc:postgresql://host.example.com:5432/student_os");
    }
}
