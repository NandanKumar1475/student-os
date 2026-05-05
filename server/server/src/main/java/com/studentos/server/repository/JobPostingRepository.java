package com.studentos.server.repository;

import com.studentos.server.entity.JobPosting;
import com.studentos.server.enums.OpportunityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {
    List<JobPosting> findByActiveTrueOrderByCreatedAtDesc();
    List<JobPosting> findByTypeAndActiveTrueOrderByCreatedAtDesc(OpportunityType type);
}
