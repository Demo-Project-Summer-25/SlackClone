package com.hire_me.Ping.dms.ws;

public final class DmTopics {
    private DmTopics() {}

    public static final String ROOT = "/topic/dms";

    public static String conversation(Long dmId) {
        return ROOT + "/" + dmId;
    }
}

