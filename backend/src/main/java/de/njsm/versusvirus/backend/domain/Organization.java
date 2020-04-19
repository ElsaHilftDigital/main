package de.njsm.versusvirus.backend.domain;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;
    private long updateOffset;
    private String urlGroupChat;
    private Long telegramGroupChatId;
    private Long telegramModeratorGroupChatId;
    private Long telegramSupportChat;

    @JoinColumn(name = "organization_id")
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Moderator> moderators = new ArrayList<>();

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getUpdateOffset() {
        return updateOffset;
    }

    public void setUpdateOffset(long updateOffset) {
        this.updateOffset = updateOffset;
    }

    public String getUrlGroupChat() {
        return urlGroupChat;
    }

    public void setUrlGroupChat(String urlGroupChat) {
        this.urlGroupChat = urlGroupChat;
    }

    public Long getTelegramGroupChatId() {
        return telegramGroupChatId;
    }

    public void setTelegramGroupChatId(Long telegramGroupChatId) {
        this.telegramGroupChatId = telegramGroupChatId;
    }

    public Long getTelegramModeratorGroupChatId() {
        return telegramModeratorGroupChatId;
    }

    public void setTelegramModeratorGroupChatId(Long telegramModeratorGroupChatId) {
        this.telegramModeratorGroupChatId = telegramModeratorGroupChatId;
    }

    public Long getTelegramSupportChat() {
        return telegramSupportChat;
    }

    public void setTelegramSupportChat(Long telegramSupportChat) {
        this.telegramSupportChat = telegramSupportChat;
    }
}
