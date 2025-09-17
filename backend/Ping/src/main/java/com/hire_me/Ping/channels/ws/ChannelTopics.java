package com.hire_me.Ping.channels.ws;

public final class ChannelTopics {

    private ChannelTopics() {}

    public static final String CHANNEL_TOPIC_PREFIX = "/topic/channels/";

    public static String getChannelTopic(Long channelId) {
        return CHANNEL_TOPIC_PREFIX + channelId;
    }
}