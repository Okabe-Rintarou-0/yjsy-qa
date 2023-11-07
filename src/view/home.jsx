import { Button, Card, Col, Input, Row, Space } from 'antd';
import 'react-chat-elements/dist/main.css'
import { AnswerLink, AssistantMessageBox, UserMessageBox } from '../components/messagebox';
import { useEffect, useState } from 'react';
import AutoLinkText from 'react-autolink-text2';
import useMessage from 'antd/es/message/useMessage';
import React from 'react';
import { DB } from '../db';

const HomeView = () => {
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState("")
    const [messageApi, contextHolder] = useMessage()
    const messageListRef = React.createRef();

    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight
        }
    }, [messages, messageListRef])

    const showQA = (qa) => {
        setMessages(messages => [
            ...messages,
            { text: qa["question"], isUser: true },
            { text: <AutoLinkText text={qa["answer"]} />, isUser: false }
        ]);
    }

    const searchReply = () => {
        let relatedQuestions = [];
        let segments = message.split("")
        let index = DB.index;
        let hitKeywords = new Set();
        let hitCnt = {};
        for (let i = 0; i < DB.data.length; i++) {
            hitCnt[i] = 0;
        }
        for (let seg of segments) {
            if (seg in index) {
                for (let idx of index[seg]) {
                    hitCnt[idx] += 1
                }
                hitKeywords.add(seg);
            }
        }

        let sortedHitCnt = Object.entries(hitCnt).filter(a => a[1] > 0).sort((a, b) => b[1] - a[1]);
        let topSixIdx = sortedHitCnt.slice(0, Math.min(6, sortedHitCnt.length)).map(entry => parseInt(entry[0]));

        for (let idx of topSixIdx) {
            relatedQuestions.push(DB.data[idx]);
        }
        if (relatedQuestions.length === 0) {
            return <div>很抱歉，未找到相关回答。</div>
        }
        return <div>
            <p>为您找到以下相关问题，点击问题即可查看答案</p>
            {relatedQuestions.map((qa, i) => <AnswerLink
                onClick={() => showQA(qa)}
                text={qa["question"]} keywords={hitKeywords} index={i + 1} />)}
        </div>
    }

    const onSend = () => {
        if (message.trim().length === 0) {
            messageApi.error("问题不能为空！")
            return;
        }
        setMessages([
            ...messages,
            { text: message, isUser: true },
            { text: searchReply(), isUser: false }
        ]);

        setMessage("")
    }

    return <div>
        {contextHolder}
        <Space direction={'vertical'} style={{ display: 'flex' }}>
            <Row justify={'center'}>
                <img src={process.env.PUBLIC_URL + '/logo.png'} alt='' />
            </Row>
            <Row justify={'center'}>
                <Col span={12}>
                    <Card bodyStyle={{ backgroundColor: "#f5f5f5f5" }}>
                        <Space direction='vertical' style={{ display: "flex" }}>
                            <div style={{ height: "500px", overflow: "scroll" }} ref={messageListRef}>
                                {messages.map((message, i) => message.isUser ? <UserMessageBox id={i} text={message.text} /> : <AssistantMessageBox id={i} text={message.text} />)}
                            </div>
                            <Row justify='space-between'>
                                <Col span={21}>
                                    <Input
                                        value={message}
                                        placeholder="请输入"
                                        allowClear
                                        onChange={(val) => setMessage(val.target.value)}
                                        onPressEnter={() => onSend()}
                                    />
                                </Col>
                                <Col span={3}><Button onClick={onSend}>发送</Button></Col>
                            </Row>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </Space>
    </div >
}

export default HomeView;