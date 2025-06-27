package springboot.test.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig{
	@Bean
	protected PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	@Bean
	protected SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

		http
				.csrf(AbstractHttpConfigurer::disable)
				.formLogin(
						formLogin->formLogin

								.loginPage("/login") // 사용자 정의 로그인 페이지
								.loginProcessingUrl("/login")
								.defaultSuccessUrl("/")// 로그인 성공 후 이동 페이지
								.failureUrl("/loginfailed") // 로그인 실패 후 이동 페이지
								.usernameParameter("username")
								.passwordParameter("password")
				)

				.logout(
						logout -> logout
								.logoutUrl("/logout")
								.logoutSuccessUrl("/login")
				);
		return http.build();
	}
}
