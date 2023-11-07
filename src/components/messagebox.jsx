import { MessageBox } from "react-chat-elements"

const AssistantMessageBox = ({ id, text }) => {
    return (
        <MessageBox
            key={id}
            id={id}
            focus={false}
            titleColor=''
            forwarded={false}
            styles={{
                marginBottom: "10px"
            }}
            removeButton={false}
            status='received'
            notch={false}
            retracted={false}
            className="chat-color"
            title="研究生院小助手"
            avatar={process.env.PUBLIC_URL + '/sjtu.svg '}
            onReplyMessageClick={() => console.log('reply clicked!')}
            position={'left'}
            type={'text'}
            text={text}
            replyButton={false}
            date={new Date()}
        />
    )
}

const UserMessageBox = ({ id, text }) => {
    return (
        <MessageBox
            key={id}
            id={id}
            styles={{
                background: "#E6E6FA",
                marginBottom: "10px"
            }}
            focus={false}
            titleColor=''
            forwarded={false}
            removeButton={false}
            status='received'
            notch={false}
            retracted={false}
            className="chat-color"
            title="你"
            avatar={process.env.PUBLIC_URL + '/user.png '}
            onReplyMessageClick={() => console.log('reply clicked!')}
            position={'right'}
            type={'text'}
            text={text}
            replyButton={false}
            date={new Date()}
        />
    )
}

const AnswerLink = ({ onClick, text, keywords, index }) => {
    const segments = text.split("")
    return (
        <a href="javascript:void(0)" onClick={(e) => {
            e.preventDefault()
            onClick();
        }} >
            <div>
                {index}.
                {segments.map(seg => {
                    if (keywords.has(seg)) {
                        return <span style={{ color: "red" }}>{seg}</span>;
                    } else {
                        return seg;
                    }
                })}
            </div>
        </a>
    )
}

export { AssistantMessageBox, UserMessageBox, AnswerLink };