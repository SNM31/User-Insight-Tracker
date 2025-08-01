package com.anirudh;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
  "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=password",
    "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.jpa.show-sql=true",
    "spring.jpa.properties.hibernate.format_sql=true",
    "jwt.secret=privthisIsMysecregtfrdesww233eggtffeeddgkjjhhtdhttebd54ndhdhfhhhshs8877465sbbddrr",
    "jwt.expiration=3600"
})
class UserInsightTrackerApplicationTests {

	@Test
	void contextLoads() {
	}
}
