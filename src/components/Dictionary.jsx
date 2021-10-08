import React, { useState } from 'react';
import {
  Button,
  Card,
  Input,
  Result,
  Skeleton,
  Space,
  Tag,
  Typography,
} from 'antd';
import './dictionary.css';

export default function Dictionary({ status, error, data, refetch, onSearch }) {
  const [value, setValue] = useState('');
  const loading = status === 'loading';
  return (
    <article className="dictionary">
      <Input.Search
        enterButton
        loading={loading}
        placeholder="Enter word"
        size="large"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onSearch={(word) => {
          setValue('');
          onSearch(word);
        }}
      />
      <Skeleton loading={loading} active={loading} paragraph={{ rows: 4 }}>
        {status === 'error' && (
          <Result
            status="error"
            title={error.title || 'Something went wrong!'}
            subTitle={error.message}
            extra={
              <Button type="primary" onClick={refetch}>
                Try again
              </Button>
            }
          />
        )}
        {status === 'success' && (
          <Space direction="vertical" style={{ width: '100%' }}>
            {data.map((record, recordIndex) => (
              <Card
                key={recordIndex}
                type="inner"
                size="small"
                title={record.word}
                extra={<Typography.Text>/{record.phonetic}/</Typography.Text>}
              >
                <div>
                  {record.meanings.map((entry, entryIndex) => (
                    <section key={entryIndex}>
                      <Typography.Text italic>
                        {entry.partOfSpeech}
                      </Typography.Text>
                      <ul>
                        {entry.definitions.map((def, defIndex) => (
                          <li key={defIndex}>
                            <Typography.Text>{def.definition}</Typography.Text>
                            <br />
                            <Typography.Text type="secondary">
                              {def.example}
                            </Typography.Text>
                            <div hidden={def.synonyms.length === 0}>
                              <Typography.Text>synonyms: </Typography.Text>
                              {def.synonyms.map((synonym) => (
                                <Tag
                                  key={synonym}
                                  color="purple"
                                  style={{ cursor: 'pointer', marginBottom: 8 }}
                                  onClick={() => onSearch(synonym)}
                                >
                                  {synonym}
                                </Tag>
                              ))}
                            </div>
                            <div hidden={def.antonyms.length === 0}>
                              <Typography.Text>antonyms: </Typography.Text>
                              {def.antonyms.map((antonym) => (
                                <Tag
                                  key={antonym}
                                  color="orange"
                                  style={{ cursor: 'pointer', marginBottom: 8 }}
                                  onClick={() => onSearch(antonym)}
                                >
                                  {antonym}
                                </Tag>
                              ))}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </Card>
            ))}
          </Space>
        )}
      </Skeleton>
    </article>
  );
}
