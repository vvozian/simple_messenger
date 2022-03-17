import styleClasses from "./App.module.css";
import React, { FC, useEffect, useRef, useState } from "react";
import { Message } from "./common/message.type";
import MessageComponent from "./components/message";

// Message container, which aligns message on left or right
// depending on sender
const MessageContainer: FC<{ type: "left" | "right" }> = ({
  type,
  children,
}) => {
  const justifyContent: string = type === "left" ? "flex-start" : "flex-end";
  const padding: string = type === "left" ? "0 50px 0 0" : "0 0 0 50px";

  return (
    <div
      className={styleClasses.messageWrap}
      style={{ justifyContent, padding }}
    >
      {children}
    </div>
  );
};

const App: FC = () => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [messageText, setMessageText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const [focusedMessageId, setFocusedMessageId] = useState<number | undefined>(
    undefined
  );

  // This effect makes a decision about changing textarea size (height).
  // How it works:
  //   1) Set textarea height to 0
  //   2) Get textarea scroll height
  //   3) Set textarea height min=0, max=(75 or scrollHeight-paddingY)
  useEffect(() => {
    if (textareaRef?.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height =
        Math.max(0, Math.min(scrollHeight - 20, 75)) + "px";
    }
  }, [messageText]);

  // Get messages on load
  useEffect(() => {
    const loadedMessages = localStorage.getItem("messages");
    if (loadedMessages) setMessages(JSON.parse(loadedMessages));
  }, []);

  async function sendMessage() {
    const newMessage = {
      id: Date.now(),
      chatId: 1,
      senderId: 1,
      content: messageText,
      date: Math.floor(Date.now()),
    };
    localStorage.setItem("messages", JSON.stringify([newMessage, ...messages]));
    setMessages([newMessage, ...messages]);
    setMessageText("");
  }

  // Submit button can send message, or delete selected
  function generateSubmitButton() {
    const style: React.CSSProperties = {};

    if (focusedMessageId != undefined) {
      style.backgroundColor = "#a66";
    }

    function clickAction() {
      if (focusedMessageId === undefined) {
        sendMessage();
      } else {
        const newMessages = messages.filter((message) => {
          return message.id != focusedMessageId;
        });
        setMessages(newMessages);
        localStorage.setItem("messages", JSON.stringify(newMessages));
      }
      setFocusedMessageId(undefined);
    }

    return (
      <button
        className={styleClasses.messageSubmitButton}
        disabled={
          Boolean(focusedMessageId === undefined) && Boolean(messageText === "")
        }
        onClick={clickAction}
        style={style}
      >
        {focusedMessageId === undefined ? "Send" : "Delete"}
      </button>
    );
  }

  return (
    <div className={styleClasses.app}>
      <div className={styleClasses.mainContainer}>
        <div className={styleClasses.chat}>
          {messages.length != 0 ? (
            messages.map((message) => {
              return (
                <MessageContainer type="right">
                  <MessageComponent
                    message={message}
                    focusId={focusedMessageId}
                    setFocusId={setFocusedMessageId}
                  />
                </MessageContainer>
              );
            })
          ) : (
            <p className={styleClasses.noMessagesYet}>No messages yet</p>
          )}
        </div>
        <div className={styleClasses.messageFormWrap}>
          <textarea
            rows={1}
            ref={textareaRef}
            className={styleClasses.messageTextArea}
            placeholder="Write a message..."
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              setMessageText(event.target.value);
            }}
            value={messageText}
          />
          {generateSubmitButton()}
        </div>
      </div>
    </div>
  );
};

export default App;
