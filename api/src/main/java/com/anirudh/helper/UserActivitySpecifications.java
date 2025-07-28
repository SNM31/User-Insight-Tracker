package com.anirudh.helper;

import com.anirudh.dto.MetricsFilterRequest;
import com.anirudh.model.UserActivity;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class UserActivitySpecifications {

    public static Specification<UserActivity> withFilters(MetricsFilterRequest request) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (request.getUserId() != null) {
                predicates.add(cb.equal(root.get("userId"), request.getUserId()));
            }

            if (request.getCountry() != null) {
                predicates.add(cb.equal(root.get("country"), request.getCountry()));
            }

            // if (request.getRegion() != null) {
            //     predicates.add(cb.equal(root.get("region"), request.getRegion()));
            // }

            if (request.getCity() != null) {
                predicates.add(cb.equal(root.get("city"), request.getCity()));
            }

            if (request.getDeviceType() != null) {
                predicates.add(cb.equal(root.get("deviceType"), request.getDeviceType()));
            }

            if (request.getStartDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("timestamp"), request.getStartDate().atStartOfDay()));
            }

            if (request.getEndDate() != null) {
                predicates.add(cb.lessThan(root.get("timestamp"), request.getEndDate().plusDays(1).atStartOfDay()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
