import styleClasses from "./styles.module.css";
import { FC, ReactNode } from "react";
import { Message } from "../../common/message.type";

// Conver unix time to hh:mm format
function unixDateToTime(date: number): string {
  const time = new Date(date);
  const hours: string = "0" + String(time.getHours());
  const minutes: string = "0" + String(time.getMinutes());

  return `${hours.slice(hours.length - 2, hours.length)}:${minutes.slice(
    minutes.length - 2,
    minutes.length
  )}`;
}

function normalizeUrl(url: string): string | undefined {
  if (!url.startsWith("https://") && !url.startsWith("http://")) {
    return `https://${url}`;
  }
}

// Convert text to list of strings and links
function urlify(text: string): (string | ReactNode)[] {
  const urlRegex =
    /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g; // eslint-disable-line
  let messages = [];

  const urlMatches = text.matchAll(urlRegex);

  let urlMatch = urlMatches.next();
  let cursor = 0;
  while (!urlMatch.done) {
    if (urlMatch.value.index !== window.undefined) {
      messages.push(text.slice(cursor, urlMatch.value.index));
      messages.push(
        <a href={normalizeUrl(urlMatch.value[0])}>{urlMatch.value[0]}</a>
      );
      cursor = urlMatch.value.index + urlMatch.value[0].length;
    }

    urlMatch = urlMatches.next();
  }
  messages.push(text.slice(cursor, text.length - cursor));
  return messages;
}

const MessageComponent: FC<{
  message: Message;
  focusId: number | undefined;
  setFocusId: any;
}> = ({ message, focusId, setFocusId }) => {
  return (
    <div
      className={styleClasses.message}
      onClick={() => {
        if (focusId !== message.id) {
          setFocusId(message.id);
        } else {
          setFocusId(undefined);
        }
      }}
      style={focusId === message.id ? { backgroundColor: "#aaa" } : {}}
    >
      <div className={styleClasses.messageText}>{urlify(message.content)}</div>
      <div className={styleClasses.messageFooter}>
        {unixDateToTime(message.date)}
      </div>
    </div>
  );
};

export default MessageComponent;
