package de.njsm.versusvirus.backend.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;
    private int updateOffset;
    private String urlGroupChat;

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getUpdateOffset() {
        return updateOffset;
    }

    public void setUpdateOffset(int updateOffset) {
        this.updateOffset = updateOffset;
    }

    public String getUrlGroupChat() {
        return urlGroupChat;
    }

    public void setUrlGroupChat(String urlGroupChat) {
        this.urlGroupChat = urlGroupChat;
    }
}
