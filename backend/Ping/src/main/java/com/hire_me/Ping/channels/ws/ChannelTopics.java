package com.hire_me.Ping.channels.ws;

import java.util.UUID;

public final class ChannelTopics {

    private ChannelTopics() {}

    public static final String CHANNEL_TOPIC_PREFIX = "/topic/channels/";

    public static String getChannelTopic(UUID channelId) {
        return CHANNEL_TOPIC_PREFIX + channelId;
    }
}