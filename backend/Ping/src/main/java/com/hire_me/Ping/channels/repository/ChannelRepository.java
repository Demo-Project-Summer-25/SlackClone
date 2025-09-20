package com.hire_me.Ping.channels.repository;

import com.hire_me.Ping.channels.entity.Channel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChannelRepository extends JpaRepository<Channel, UUID> {

   Optional<Channel> findByName(String name);

    List<Channel> findByMembersUserId(UUID userId);

    // ✅ New method with fetch join to avoid LazyInitializationException
    @Query("""
           SELECT DISTINCT c 
           FROM Channel c 
           JOIN FETCH c.createdBy 
           JOIN c.members m 
           WHERE m.user.id = :userId
           """)
    List<Channel> findChannelsByUserIdWithCreator(@Param("userId") UUID userId);
}