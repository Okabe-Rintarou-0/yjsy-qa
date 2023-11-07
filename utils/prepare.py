import json
import re
import jieba
import pandas as pd

jieba.load_userdict("./dict.txt")
data = []
df = pd.read_excel("qa.xlsx")
for index, row in df.iterrows():
    data.append({"question": row["问题"], "answer": row["回答"]})

reverse_index = {}
i = 0
for qa in data:
    q = qa["question"]
    q = re.sub(r"[^\w\s]", "", q)
    for char in q:
        if char not in reverse_index:
            reverse_index[char] = []
        reverse_index[char].append(i)
    # seg_list = list(jieba.cut(q, cut_all=False))
    # for seg in seg_list:
    #     if seg not in reverse_index:
    #         reverse_index[seg] = []
    #     reverse_index[seg].append(i)
    i += 1

out = {"data": data, "index": reverse_index}

with open("../src/db.js", "w") as f:
    f.write(f"export const DB = {json.dumps(out, ensure_ascii=False, indent=4)}")
