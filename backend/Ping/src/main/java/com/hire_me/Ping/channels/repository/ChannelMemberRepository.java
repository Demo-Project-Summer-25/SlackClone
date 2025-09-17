package com.hire_me.Ping.channels.repository;

import com.hire_me.Ping.channels.entity.ChannelMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChannelMemberRepository extends JpaRepository<ChannelMember, UUID> {

    /**
     * Finds a specific membership entry by channel and user IDs.
     * @param channelId The ID of the channel.
     * @param userId The ID of the user.
     * @return An Optional containing the ChannelMember if found.
     */
    Optional<ChannelMember> findByChannelIdAndUserId(Long channelId, UUID userId);

    /**
     * Retrieves all members for a given channel ID.
     * This query uses a JOIN FETCH to eagerly load user details, preventing N+1 query problems.
     * @param channelId The ID of the channel.
     * @return A list of members for the channel.
     */
    @Query("SELECT cm FROM ChannelMember cm JOIN FETCH cm.user WHERE cm.channel.id = :channelId")
    List<ChannelMember> findAllByChannelId(Long channelId);

    /**
     * Deletes a membership entry by channel and user IDs.
     * @param channelId The ID of the channel.
     * @param userId The ID of the user.
     */
    void deleteByChannelIdAndUserId(Long channelId, UUID userId);
}