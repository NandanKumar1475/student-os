package com.studentos.server;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.util.UriComponentsBuilder;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class ServerApplicationTests {

	@Autowired
	private TestRestTemplate restTemplate;

	@Autowired
	private CorsConfigurationSource corsConfigurationSource;

	@Test
	void contextLoads() {
	}

	@Test
	void healthEndpointIsPublic() {
		ResponseEntity<String> response = restTemplate.getForEntity("/actuator/health", String.class);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).contains("\"status\":\"UP\"");
	}

	@Test
	void optionsRequestsAreNotBlockedBySecurity() {
		HttpHeaders headers = new HttpHeaders();
		headers.setOrigin("http://localhost:5173");
		headers.setAccessControlRequestMethod(HttpMethod.GET);
		headers.setAccessControlRequestHeaders(java.util.List.of("authorization", "content-type"));

		ResponseEntity<String> response = restTemplate.exchange(
				"/api/targets",
				HttpMethod.OPTIONS,
				new HttpEntity<>(headers),
				String.class
		);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
	}

	@Test
	void corsConfigurationAllowsFrontendOriginAndAuthHeaders() {
		jakarta.servlet.http.HttpServletRequest request =
				new org.springframework.mock.web.MockHttpServletRequest(
						HttpMethod.OPTIONS.name(),
						UriComponentsBuilder.fromPath("/api/targets").toUriString()
				);

		CorsConfiguration configuration = corsConfigurationSource.getCorsConfiguration(request);

		assertThat(configuration).isNotNull();
		assertThat(configuration.checkOrigin("http://localhost:5173")).isEqualTo("http://localhost:5173");
		assertThat(configuration.getAllowCredentials()).isTrue();
		assertThat(configuration.checkHeaders(java.util.List.of("authorization", "content-type")))
				.containsExactly("authorization", "content-type");
	}
}
