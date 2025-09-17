package com.hire_me.Ping.channels.repository;

import com.hire_me.Ping.channels.entity.Channel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface ChannelRepository extends JpaRepository<Channel, Long> {

    /**
     * Finds a channel by its unique name.
     * @param name The name of the channel.
     * @return An Optional containing the channel if found.
     */
    Optional<Channel> findByName(String name);
}