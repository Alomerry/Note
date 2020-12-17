# Programming Ability Test

## 简介

### 乙级

考生应具备以下基本能力：

- 基本的C/C++的代码设计能力，以及相关开发环境的基本调试技巧；

- 理解并掌握最基本的数据存储结构，即：数组、链表；

- 理解并熟练编程实现与基本数据结构相关的基础算法，包括递归、排序、查找等；

- 能够分析算法的时间复杂度、空间复杂度和算法稳定性；

- 具备问题抽象和建模的初步能力，并能够用所学方法解决实际问题。

### 甲级

在达到乙级要求的基础上，还要求：

- 具有充分的英文阅读理解能力；

- 理解并掌握基础数据结构，包括：线性表、树、图；

- 理解并熟练编程实现经典高级算法，包括哈希映射、并查集、最短路径、拓扑排序、关键路径、贪心、深度优先搜索、广度优先搜索、回溯剪枝等；

- 具备较强的问题抽象和建模能力，能实现对复杂实际问题的模拟求解。

### 顶级

在达到甲级要求的基础上，还要求：

- 对高级、复杂数据结构掌握其用法并能够熟练使用，如后缀数组、树状数组、线段树、Treap、静态KDTree等；

- 能够利用经典算法思想解决较难的算法问题，如动态规划、计算几何、图论高级应用（包括最大流/最小割，强连通分支、最近公共祖先、最小生成树、欧拉序列）等，并灵活运用；

- 能够解决复杂的模拟问题，编写并调试代码量较大的程序；

- 具有缜密的科学思维，考虑问题周全，能够正确应对复杂问题的边界情况。

## PTA 甲级题解

### 1-50

#### 1003

main.cpp

```c
#include <iostream>
#include <vector>
#include <algorithm>
#include <math.h>

#define INF 0x3fffffff
using namespace std;
int n, m, c1, c2;
int resure[500];
int d[500];
int g[500][500] = {0};
int vis[500];
vector<int> pre[500];
int action_now = 0, action = 0, approach = 0;

void Dij()
{
    fill(d, d + 500, INF);
    fill(vis, vis + 500, false);
    d[c1] = 0;
    int u = -1, min = INF;
    for (int i = 0; i < n; i++)
    {
        u = -1, min = INF;
        for (int j = 0; j < n; j++)
        {
            if (vis[j] == false && d[j] < min)
            {
                min = d[j];
                u = j;
            }
        }
        vis[u] = true;
        for (int j = 0; j < n; j++)
        {
            if (vis[j] == false && g[u][j] > 0)
            {
                if ((d[u] + g[u][j]) == d[j])
                {
                    pre[j].push_back(u);
                }
                else if ((d[u] + g[u][j]) < d[j])
                {
                    pre[j].clear();
                    pre[j].push_back(u);
                    d[j] = d[u] + g[u][j];
                }
            }
        }
    }
}
void dfs(int index)
{
    action_now += resure[index];
    if (index != c1)
    {
        for (int i = 0; i < pre[index].size(); i++)
        {
            dfs(pre[index][i]);
        }
    }
    else
    {
        action = max(action, action_now);
        ++approach;
    }
    action_now -= resure[index];
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    /**
     * 计算最短路径
     * 记录并计算最短路径条数同时计算最多援助
     */
    int tmp_a, tmp_b;
    cin >> n >> m >> c1 >> c2;
    for (int i = 0; i < n; i++)
        cin >> resure[i];
    for (int i = 0; i < m; i++)
    {
        cin >> tmp_a >> tmp_b;
        cin >> g[tmp_a][tmp_b];
        g[tmp_b][tmp_a] = g[tmp_a][tmp_b];
    }
    Dij();
    dfs(c2);
    cout << approach << " " << action << endl;
    return 0;
}
```

bf.cpp

```c
#include <iostream>
#include <algorithm>
#include <set>
#include <vector>
const int INF = 0x3fffffff;
const int MAX_SIZE = 501;
using namespace std;
struct Node
{
    int v, len;
    Node(int _v, int _len) : v(_v), len(_len){};
};

int rescure[MAX_SIZE], num[MAX_SIZE], w[MAX_SIZE], d[MAX_SIZE];
vector<Node> graph[MAX_SIZE];
set<int> pre[MAX_SIZE];

void bf(int s, int n)
{
    fill(d, d + MAX_SIZE, INF);
    fill(num, num + MAX_SIZE, 0);
    fill(w, w + MAX_SIZE, 0);
    d[s] = 0;
    w[s] = rescure[s];
    num[s] = 1;
    for (int i = 0; i < n - 1; i++)
    {
        for (int u = 0; u < n; u++)
        {
            for (int j = 0; j < graph[u].size(); j++)
            {
                int v = graph[u][j].v;
                int dis = graph[u][j].len;
                if (dis + d[u] < d[v])
                {
                    d[v] = dis + d[u];
                    w[v] = w[u] + rescure[v];
                    pre[v].clear();
                    pre[v].insert(u);
                    num[v] = num[u];
                }
                else if (dis + d[u] == d[v])
                {
                    if (w[u] + rescure[v] > w[v])
                    {
                        w[v] = w[u] + rescure[v];
                    }
                    pre[v].insert(u);
                    num[v] = 0;
                    for (set<int>::iterator it = pre[v].begin(); it != pre[v].end(); it++)
                    {
                        num[v] += num[(*it)];
                    }
                }
            }
        }
    }
}

int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    int n, m, c1, c2, ta, tb, tl;
    cin >> n >> m >> c1 >> c2;
    for (int i = 0; i < n; i++)
    {
        cin >> rescure[i];
    }
    for (int i = 0; i < m; i++)
    {
        cin >> ta >> tb >> tl;
        graph[ta].push_back(Node(tb, tl));
        graph[tb].push_back(Node(ta, tl));
    }

    bf(c1, n);
    cout << num[c2] << " " << w[c2] << endl;
    return 0;
}
```

spfa.cpp

```c
#include <iostream>
#include <algorithm>
#include <set>
#include <vector>
#include <queue>
const int  INF =  0x3fffffff;
const int MAX_SIZE = 501;
using namespace std;
struct Node{
	int v,len;
	Node(int _v,int _len):v(_v),len(_len){};
};

int rescure[MAX_SIZE],d[MAX_SIZE],inq[MAX_SIZE]={0},max_re = 0,now_re,result=0;
bool vis[MAX_SIZE] = {false};
vector<Node> graph[MAX_SIZE];
set<int> pre[MAX_SIZE];

bool bf(int s,int n){
	fill(d,d+MAX_SIZE,INF);
	fill(vis,vis+MAX_SIZE,false);
	fill(inq,inq+MAX_SIZE,0);
	vis[s] = true;
	d[s] = 0;
	inq[s]++;
	queue<int> q;
	q.push(s);
	while(!q.empty()){
		int u = q.front();
		q.pop();
		vis[u] = false;
		for(int j=0;j<graph[u].size();j++){
			int v = graph[u][j].v;
			int dis= graph[u][j].len;
			if(dis+d[u] <d[v]){
				d[v] = dis+d[u];
				pre[v].clear();
				pre[v].insert(u);
				if(vis[v] == false){
					q.push(v);
					vis[v] = true;
					inq[v]++;
					//if(inq[v] >=n)
						//return false;
				}
			}else if(dis+d[u] == d[v]){
				pre[v].insert(u);
			}
		}
	}
	return true;
}
void dfs(int now,int start){
	now_re += rescure[now];
	if(now == start ){
		result ++;
		if(now_re > max_re)
			max_re = now_re;
		now_re -= rescure[now];
		return ;
	}
	for(set<int>::iterator it = pre[now].begin();it!=pre[now].end();it++){
		dfs(*it,start);
	}

	now_re -= rescure[now];
}
int main()
{
	std::ios::sync_with_stdio(false);
	std::cin.tie(0);
	int n,m,c1,c2,ta,tb,tl;
	cin>>n>>m>>c1>>c2;
	for(int i = 0;i<n;i++){
		cin>>rescure[i];
	}
	for(int i = 0;i<m;i++){
		cin>>ta>>tb>>tl;
		graph[ta].push_back(Node(tb,tl));
		graph[tb].push_back(Node(ta,tl));
	}

	bf(c1,n);
	dfs(c2,c1);
	cout<<result<<" "<<max_re<<endl;
	return 0;
}
```

#### 1004

main.cpp

```c
#include <string>
#include <iostream>
#include <vector>
#include <map>
#include <math.h>
#define max_size 101
using namespace std;
int n, m;
map<int, int> leaf;
struct node
{
    int deepth;
    vector<int> sons;
    node()
    {
        deepth = 0;
    }
};
node tree[max_size];
bool isRoot[max_size];
void dfs(int root)
{

    if (leaf.find(tree[root].deepth) == leaf.end())
    {
        leaf[tree[root].deepth] = 0;
    }
    if (tree[root].sons.size() == 0)
    {
        leaf[tree[root].deepth]++;
        return;
    }
    for (int i = 0; i < tree[root].sons.size(); i++)
    {
        int son = tree[root].sons[i];
        tree[son].deepth = tree[root].deepth + 1;
        dfs(son);
    }
}
int main()
{
    cin >> n >> m;
    fill(isRoot + 1, isRoot + n + 1, true);
    for (int i = 0; i < m; i++)
    {
        int a, b, c;
        string sa, sc;
        cin >> sa >> b;
        a = (sa[0] - '0') * 10 + sa[1] - '0';
        for (int j = 0; j < b; j++)
        {
            cin >> sc;
            c = (sc[0] - '0') * 10 + sc[1] - '0';
            tree[a].sons.push_back(c);
            isRoot[c] = false;
        }
    }
    int root;
    for (root = 1; root <= n; root++)
    {
        if (isRoot[root])
            break;
    }
    dfs(root);
    for (map<int, int>::iterator it = leaf.begin(); it != leaf.end(); it++)
    {
        if (it != leaf.begin())
            cout << " ";
        cout << it->second;
    }

    return 0;
}
```



#### 1010

radix.cpp

```c
#include <iostream>
#include <string>
#include <cctype>
#include <algorithm>
#include <cmath>
#include <cctype>
using namespace std;
int getItem(char a)
{
    if (a <= '9' && a >= '0')
        return a - '0';
    if (a <= 'z' && a >= 'a')
        return a - 'a' + 10;
}
long long getValue(string a, long long radix)
{
    long long res = 0;
    int index = 0;
    for (int i = a.size() - 1; i >= 0; --i)
    {
        res += getItem(a[i]) * pow(radix, index);
        ++index;
    }
    return res;
}
long long getRadix(string other, long long val)
{
    char it = *max_element(other.begin(), other.end());
    long long left_radix = (isdigit(it) ? it - '0' : it - 'a' + 10) + 1;
    long long right_radix = max(val, left_radix);

    while (left_radix <= right_radix)
    {
        long long mid = (left_radix + right_radix) / 2;
        long long other_val = getValue(other, mid);
        if (other_val == val)
        {
            return mid;
        }
        else if (val < other_val || other_val < 0)
        {
            right_radix = mid - 1;
        }
        else if (val > other_val)
        {
            left_radix = mid + 1;
        }
    }
    return -1;
}
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    string n1, n2;
    long long tag = 0, radix = 0;

    cin >> n1 >> n2 >> tag >> radix;

    string a = tag == 1 ? n1 : n2, b = tag == 1 ? n2 : n1;
    long long result = getRadix(b, getValue(a, radix));
    if (result != -1)
    {
        cout << result << endl;
    }
    else
    {
        cout << "Impossible" << endl;
    }
    return 0;
}
```



#### 1011

main.cpp

```c
#include <iostream>
#include <vector>
#include <algorithm>
#include <map>
using namespace std;
char s[3] = {'W', 'T', 'L'};
int main()
{
    float now[3], res = 1.0;
    int k = 0;
    for (int i = 0; i < 3; i++)
    {
        for (int j = 0; j < 3; j++)
        {
            scanf("%lf", &now[j]);
            if (now[j] > k)
                k = j;
        }
        res *= now[k];
        printf("%c ", s[k]);
    }
    printf("%.2f", (res*0.65-1)*2);
    return 0;
}
```



#### 1012

sort.cpp

```c
#include <iostream>
#include <algorithm>
#include <math.h>

using namespace std;
char out[4] = {'A', 'C', 'M', 'E'};
int index = 0;
int map[999999][4];
struct Student
{
    int id;
    int acme[4];
    void get_a()
    {
        acme[0] = (acme[3] + acme[1] + acme[2]) / 3;
    }
};
bool cmp(Student a, Student b)
{
    return a.acme[index] > b.acme[index];
}

main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    int n, m, id;

    cin >> n >> m;
    Student stu[n];
    for (int i = 0; i < n; i++)
    {
        cin >> stu[i].id >> stu[i].acme[1] >> stu[i].acme[2] >> stu[i].acme[3];
        stu[i].get_a();
    }
    for (index = 0; index < 4; index++)
    {
        sort(stu, stu + n, cmp);
        map[stu[0].id][index] = 1;
        for (int j = 1; j < n; j++)
        {
            if (stu[j].acme[index] == stu[j - 1].acme[index])
            {
                map[stu[j].id][index] = map[stu[j - 1].id][index];
            }
            else
            {
                map[stu[j].id][index] = j + 1;
            }
        }
    }

    for (int i = 0; i < m; i++)
    {
        cin >> id;
        bool flag = false;
        for (int j = 0; j < n && !flag; j++)
        {
            if (stu[j].id == id)
            {
                flag = true;
            }
        }
        if (flag)
        {
            int min = *min_element(map[id], map[id] + 4);
            char res;
            for (int j = 0; j < 4; j++)
            {
                if (map[id][j] == min)
                {
                    res = out[j];
                    break;
                }
            }
            cout << min << " " << res << endl;
        }
        else
        {
            cout << "N/A" << endl;
        }
    }

    return 0;
}

```



#### 1013

dfs.cpp

```c
#include <iostream>
#include <vector>
using namespace std;

int n, m, k, check[1001], checked[1001], now = 0;
vector<int> g[1001];
bool vis[1001] = {false};

void dfs(int index)
{
    if (vis[index] == true)
    {
        return;
    }
    ++now;
    vis[index] = true;
    for (int i = 0; i < g[index].size(); i++)
    {
        dfs(g[index][i]);
    }
}

void caculate()
{
    for (int i = 0; i < k; i++)
    {
        fill(vis, vis + 1001, false);
        vis[check[i]] = true;
        now = 0;
        for (int j = 1; j <= n; j++)
        {
            if (now < (n - 1) && vis[j] == false)
            {
                dfs(j);
                ++checked[i];
            }
        }
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> m >> k;
    int tmp_a, tmp_b;
    for (int i = 0; i < m; i++)
    {
        cin >> tmp_a >> tmp_b;
        g[tmp_a].push_back(tmp_b);
        g[tmp_b].push_back(tmp_a);
    }
    for (int i = 0; i < k; i++)
        cin >> check[i];
    caculate();
    for (int i = 0; i < k; i++)
        if (i == 0)
        {
            cout << checked[i] - 1;
        }
        else
        {
            cout << endl
                 << checked[i] - 1;
        }
    return 0;
}
```



#### 1016

main.cpp

```c
#include <iostream>
#include <algorithm>
#include <stdlib.h>
#include <map>
#include <string>
#include <vector>
using namespace std;
float per[24], one_day_money;
struct recode
{
    string name, time;
    string o_f;
};
struct bill
{
    string name, month, start, end;
    int min;
    float money;
    bill()
    {
        min = 0;
        money = 0;
    }
};
bool cmp(recode a, recode b)
{
    return a.name != b.name ? a.name < b.name : a.time < b.time;
}
bill caculate(recode a, recode b)
{
    bill tmp;
    tmp.name = a.name, tmp.month = a.time.substr(0, 2);
    a.time.erase(0, 3), b.time.erase(0, 3);
    tmp.start = a.time, tmp.end = b.time;
    tmp.min = (atoi(tmp.end.substr(0, 2).c_str()) - atoi(tmp.start.substr(0, 2).c_str())) * 1440;
    tmp.money = (atoi(tmp.end.substr(0, 2).c_str()) - atoi(tmp.start.substr(0, 2).c_str())) * 60 * one_day_money;
    int houra = atoi(tmp.start.substr(3, 5).c_str()), hourb = atoi(tmp.end.substr(3, 5).c_str());
    tmp.min -= atoi(tmp.start.substr(6, 8).c_str());
    tmp.money -= (per[houra] * atoi(tmp.start.substr(6, 8).c_str()));
    tmp.min += atoi(tmp.end.substr(6, 8).c_str());
    tmp.money += (per[hourb] * atoi(tmp.end.substr(6, 8).c_str()));
    while (houra > 0)
    {
        tmp.min -= 60;
        --houra;
        tmp.money -= per[houra] * 60;
    }
    while (hourb > 0)
    {
        tmp.min += 60;
        --hourb;
        tmp.money += per[hourb] * 60;
    }
    return tmp;
}
int main()
{
    // std::ios::sync_with_stdio(false);
    // std::cin.tie(0);

    int n;
    vector<recode> recodes;
    map<string, vector<bill>> bills;
    recode tmp;
    string flag;

    for (int i = 0; i < 24; i++)
    {
        cin >> per[i];
        per[i] = per[i];
        one_day_money += per[i];
    }
    cin >> n;
    for (int i = 0; i < n; i++)
    {
        cin >> tmp.name >> tmp.time >> tmp.o_f;
        recodes.push_back(tmp);
    }
    sort(recodes.begin(), recodes.end(), cmp);
    for (int i = 0; (i + 1) < recodes.size();)
    {
        //如果此次名字和下个名字一样，且这次是online,下次是offline则正确
        if (recodes[i].name == recodes[i + 1].name && (recodes[i].o_f[1] == 'n' && recodes[i + 1].o_f[1] == 'f'))
        {
            //有效数据 计算金钱
            bills[recodes[i].name].push_back(caculate(recodes[i], recodes[i + 1]));
            i += 2;
            continue;
        }
        ++i;
    }
    for (map<string, vector<bill>>::iterator i = bills.begin(); i != bills.end(); i++)
    {
        vector<bill> item = (*i).second;
        cout << item[0].name << " " << item[0].month << endl;
        float total = 0;
        for (int j = 0; j < item.size(); j++)
        {
            cout << item[j].start << " " << item[j].end << " " << item[j].min << " $";
            total += item[j].money / 100;
            printf("%.2f\n", item[j].money / 100);
        }
        cout << "Total amount: $";
        printf("%.2f\n", total);
    }
    return 0;
}

```



#### 1020

main.cpp

```c
#include <iostream>
#include <queue>
#define MAXSIZE 31
using namespace std;
int in[MAXSIZE], post[MAXSIZE], n;
struct node
{
    int v;
    node *left, *right;
};
node *create(int inl, int inr, int postl, int postr)
{
    if (postl > postr)
        return NULL;
    node *root = new node;
    root->v = post[postr];
    int i = 0;
    for (i = inl; i <= inr; i++)
    {
        if (in[i] == post[postr])
            break;
    }
    root->left = create(inl, i - 1, postl, postl + i - inl - 1);
    root->right = create(i + 1, inr, postl + i - inl, postr - 1);
    return root;
}
void travel()
{
    queue<node *> q;
    node *root = create(0, n-1, 0, n-1);
    q.push(root);
    bool flag = false;
    while (!q.empty())
    {
        root = q.front();
        q.pop();
        if (flag)
            cout << " ";
        flag = true;
        cout << root->v;
        if(root->left!=NULL)q.push(root->left);
        if(root->right!=NULL)q.push(root->right);
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    for (int i = 0; i < n; i++)
        cin >> post[i];
    for (int i = 0; i < n; i++)
        cin >> in[i];
    travel();
    return 0;
}
```



#### 1021

bfs.cpp

```c
/*
 * 测试点3超时
 */

#include <iostream>
#include <vector>
#include <stack>
#include <set>
#include <math.h>
using namespace std;
struct Node
{
    int con, depth;
};
int n, maxi = 0, vis[10001] = {false}, part = 1;
vector<Node> g[10001];
set<int> result;

int bfs(int i)
{
    stack<Node> q;
    Node tmp;
    tmp.con = i;
    tmp.depth = 0;
    q.push(tmp);
    part = 0;
    fill(vis, vis + 10001, false);
    vis[tmp.con] = true;
    int components = 1;
    while (true)
    {
        while (!q.empty())
        {
            Node t = q.top();
            if (maxi < t.depth)
            {
                maxi = t.depth;
                result.clear();
                result.insert(t.con);
            }
            else if (maxi == t.depth)
            {
                result.insert(t.con);
            }
            q.pop();
            for (int j = 0; j < g[t.con].size(); j++)
            {
                if (vis[g[t.con][j].con] == false)
                {
                    vis[g[t.con][j].con] = true;
                    ++components;
                    g[t.con][j].depth = t.depth + 1;
                    q.push(g[t.con][j]);
                }
            }
        }
        ++part;
        if (components < n)
        {
            for (int j = 1; j <= n; j++)
            {
                if (vis[j] == false)
                {
                    vis[j] = true;
                    ++components;
                    tmp.con = j;
                    tmp.depth = 0;
                    q.push(tmp);
                    break;
                }
            }
        }
        else
        {
            return part;
        }
    }
    return part;
}

int main()
{
    cin >> n;
    Node tmpa, tmpb;
    for (int i = 1; i < n; i++)
    {
        cin >> tmpa.con >> tmpb.con;
        g[tmpa.con].push_back(tmpb);
        g[tmpb.con].push_back(tmpa);
    }

    for (int i = 1; i <= n && part == 1; i++)
    {
        part = bfs(i);
    }
    if (part != 1)
    {
        cout << "Error: " << part << " components" << endl;
    }
    else
    {
        for (set<int>::iterator it = result.begin(); it != result.end(); it++)
        {
            cout << *(it) << endl;
        }
    }
    return 0;
}

```



dfs.cpp

```c
#include <iostream>
#include <algorithm>
#include <set>
#include <vector>
#define MAX_SIZE 10005
using namespace std;

struct Node
{
	int val;
	int deepth;
	Node()
	{
		deepth = 0;
	}
};
int n, deepth[MAX_SIZE], maxi = 0;
vector<int> maps[MAX_SIZE];
set<int> res, temp;
bool vis[MAX_SIZE] = {false};

void dfs(int i)
{
	vis[i] = true;
	for (int j = 0; j < maps[i].size(); j++)
	{
		int item = maps[i][j];
		if (vis[item] == false)
		{
			deepth[item] = deepth[i] + 1;
			maxi = max(maxi, deepth[item]);
			dfs(item);
		}
	}
}
int check()
{
	int k = 0;
	for (int j = 1; j <= n; j++)
	{
		if (vis[j] == false)
		{
			k++;
			dfs(j);
		}
	}

	if (k > 1)
		return k;
	return 0;
}
int main()
{
	std::ios::sync_with_stdio(false);
	std::cin.tie(0);

	int i, j, a, b;
	Node tem;
	cin >> n;
	for (i = 1; i < n; i++)
	{
		cin >> a >> b;
		maps[a].push_back(b);
		maps[b].push_back(a);
	}

	deepth[1] = 1;
	a = check();
	if (a != 0)
	{
		cout << "Error: " << a << " components" << endl;
		return 0;
	}

	for (i = 1; i <= n; i++)
	{
		if (deepth[i] == maxi)
		{
			temp.insert(i);
		}
	}

	fill(vis, vis + MAX_SIZE, false);
	fill(deepth, deepth + MAX_SIZE, 0);

	a = *(temp.begin());
	deepth[a] = 1;
	dfs(a);

	for (i = 1; i <= n; i++)
	{
		if (deepth[i] == maxi)
		{
			res.insert(i);
		}
	}
	for (set<int>::iterator it = temp.begin(); it != temp.end(); it++)
	{
		res.insert(*it);
	}

	for (set<int>::iterator it = res.begin(); it != res.end(); it++)
	{
		cout << *it << endl;
	}
	return 0;
}
```



#### 1025

priority_queue.cpp

```c
#include <iostream>
#include <algorithm>
#include <queue>
#include <vector>
#include <string>
using namespace std;
struct student
{
    string id;
    int point;
    int final_rank = 1;
    int local_rank = 1;
    int room;
    friend bool operator<(student a, student b)
    {
        if (a.point < b.point)
            return true;
        else if (a.point == b.point)
        {
            return a.id > b.id;
        }
        else
        {
            return false;
        }
    }
};
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    //读取班级数
    //读取学生信息
    //遍历一次，并更新班级排名和班级
    //放入优先队列中
    priority_queue<student> total, locale;

    int room_numer, each_number, total_number = 0;

    student stu;

    cin >> room_numer;
    for (int ri = 1; ri <= room_numer; ri++)
    {
        cin >> each_number;
        total_number += each_number;
        for (int ci = 1; ci <= each_number; ci++)
        {
            cin >> stu.id >> stu.point;
            stu.room = ri;
            locale.push(stu);
        }
        int rank = 1, point = -1, i = 0;
        while (!locale.empty())
        {
            stu = locale.top();
            ++i;
            if (point == -1 || point == stu.point)
            {
                stu.local_rank = rank;
            }
            else
            {
                rank = i;
                stu.local_rank = rank;
            }
            point = stu.point;
            locale.pop();
            total.push(stu);
        }
    }
    int rank = 1, point = -1, i = 0;
    cout << total_number << endl;
    while (!total.empty())
    {
        stu = total.top();
        ++i;
        if (point == -1 || point == stu.point)
        {
            stu.final_rank = rank;
        }
        else
        {
            rank = i;
            stu.final_rank = rank;
        }
        if (point != -1)
        {
            cout << endl;
        }
        point = stu.point;
        cout << stu.id << " " << stu.final_rank << " " << stu.room << " " << stu.local_rank;
        total.pop();
    }
    return 0;
}
```

sort.cpp

```c
#include <iostream>
#include <algorithm>
#include <string>
#include <vector>
using namespace std;
struct student
{
    string id;
    int point;
    int final_rank = 1;
    int local_rank = 1;
    int room;
};
bool cmp(student a, student b)
{
    if (a.point != b.point)
        return a.point > b.point;
    else
    {
        return a.id < b.id;
    }
}
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);

    int room_numer = 1, each_number = 1;

    cin >> room_numer;
    vector<student> stus;

    //读取一个班排序一个班并写入班级排名
    //最后排名所有人
    for (int ri = 1; ri <= room_numer; ri++)
    {
        int ci = 1;
        cin >> each_number;
        vector<student> clas(each_number);
        for (ci = 0; ci < each_number; ci++)
        {
            cin >> clas[ci].id >> clas[ci].point;
            clas[ci].room = ri;
        }
        std::sort(clas.begin(), clas.end(), cmp);
        int i = 1;
        stus.push_back(clas[0]);
        for (; i < clas.size(); i++)
        {
            clas[i].local_rank = (clas[i].point == clas[i - 1].point) ? clas[i - 1].local_rank : i + 1;
            stus.push_back(clas[i]);
        }
    }
    cout << stus.size() << endl;
    std::sort(stus.begin(), stus.end(), cmp);
    int i = 1;
    cout << stus[0].id << " " << 1 << " " << stus[0].room << " " << stus[0].local_rank;
    for (; i < stus.size(); i++)
    {
        cout << endl
             << stus[i].id << " " << (stus[i].point == stus[i - 1].point ? stus[i - 1].final_rank : i + 1) << " " << stus[i].room << " "
             << stus[i].local_rank;
        stus[i].final_rank = (stus[i].point == stus[i - 1].point ? stus[i - 1].final_rank : i + 1);
    }
    return 0;
}
```



#### 1028

sort.cpp

```c
#include <iostream>
#include <algorithm>
#include <string>
#include <vector>
using namespace std;
struct stu
{
    string id, name;
    int grade;
};
bool sortColId(stu a, stu b)
{
    return a.id < b.id;
}
bool sortColName(stu a, stu b)
{
    if (a.name != b.name)
    {
        return a.name < b.name;
    }
    else
    {
        return a.id < b.id;
    }
}
bool sortColGrade(stu a, stu b)
{
    if (a.grade != b.grade)
    {
        return a.grade < b.grade;
    }
    else
    {
        return a.id < b.id;
    }
}
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    int n, c;

    cin >> n >> c;
    vector<stu> stus(n);
    for (int i = 0; i < n; i++)
    {
        cin >> stus[i].id >> stus[i].name >> stus[i].grade;
    }
    switch (c)
    {
    case 1:
        sort(stus.begin(), stus.end(), sortColId);
        break;
    case 2:
        sort(stus.begin(), stus.end(), sortColName);
        break;
    case 3:
        sort(stus.begin(), stus.end(), sortColGrade);
        break;
    }
    for (int i = 0; i < n; i++)
    {
        cout << ((i != 0) ? "\n" : "") << stus[i].id << " " << stus[i].name << " " << stus[i].grade;
    }
    return 0;
}
```



#### 1030

dij.cpp

```c
#include <iostream>
#include <vector>
#define INF 0x3fffffff
using namespace std;
struct node
{
    int len, cost;
};
node g[500][500];
vector<int> pre[500], path, out;
bool vis[500] = {false};
int d[500], mini = INF, now = 0;
;
void dij(int n, int c1, int c2)
{
    fill(d, d + n, INF);
    int u, min;
    d[c1] = 0;
    for (int i = 0; i < n; i++)
    {
        u = -1, min = INF;
        for (int j = 0; j < n; j++)
        {
            if (vis[j] == false && d[j] < min)
            {
                u = j;
                min = d[j];
            }
        }
        if (u == -1)
        {
            return;
        }
        vis[u] = true;
        for (int j = 0; j < n; j++)
        {
            if (vis[j] == false && g[u][j].len > 0)
            {
                if (d[j] > d[u] + g[u][j].len)
                {
                    d[j] = d[u] + g[u][j].len;
                    pre[j].clear();
                    pre[j].push_back(u);
                }
                else if (d[j] == (d[u] + g[u][j].len))
                    pre[j].push_back(u);
            }
        }
    }
}
void dfs(int index, int end)
{
    if (index == end)
    {
        if (mini > now)
        {
            mini = now;
            out.clear();
            out = path;
        }
        return;
    }
    for (int i = 0; i < pre[index].size(); i++)
    {
        now += g[index][pre[index][i]].cost;
        path.push_back(pre[index][i]);
        dfs(pre[index][i], end);
        now -= g[index][pre[index][i]].cost;
        path.pop_back();
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    int n, m, c1, c2, ta, tb;
    node tmp;
    cin >> n >> m >> c1 >> c2;
    for (int i = 0; i < m; i++)
    {
        cin >> ta >> tb;
        cin >> tmp.len >> tmp.cost;
        g[ta][tb] = tmp;
        g[tb][ta] = tmp;
    }
    dij(n, c1, c2);
    path.push_back(c2);
    dfs(c2, c1);
    for (int i = out.size() - 1; i >= 0; i--)
    {
        cout << out[i] << " ";
    }
    cout << d[c2] << " " << mini;
    return 0;
}

```

spfa.cpp

```c
#define MAX_SIZE 501
#include <iostream>
#include <algorithm>
#include <set>
#include <vector>
#include <queue>
const int INF = 0x3fffffff;
using namespace std;

int n, m, s, d, dis[MAX_SIZE], num[MAX_SIZE], cost = 0, mini_cost = INF;
struct Node
{
	int v, len;
	Node(int _v, int _len) : v(_v), len(_len) {}
};
int costs[MAX_SIZE][MAX_SIZE];
vector<Node> graph[MAX_SIZE];
vector<int> path_out, path_now;
bool inq[MAX_SIZE];
set<int> pre[MAX_SIZE];

bool spfa(int s)
{
	fill(inq, inq + MAX_SIZE, false);
	fill(dis, dis + MAX_SIZE, INF);
	fill(num, num + MAX_SIZE, 0);

	dis[s] = 0;
	queue<int> q;
	q.push(s);
	inq[s] = true;
	++num[s];

	while (!q.empty())
	{
		int u = q.front();
		q.pop();
		inq[u] = false;

		for (int j = 0; j < graph[u].size(); j++)
		{
			int v = graph[u][j].v;
			int length = graph[u][j].len;
			if (dis[u] + length < dis[v])
			{
				dis[v] = dis[u] + length;
				pre[v].clear();
				pre[v].insert(u);
				if (!inq[v])
				{
					q.push(v);
					inq[v] = true;
					++num[v];
					if (num[v] > n)
					{
						return false;
					}
				}
			}
			else if (dis[u] + length == dis[v])
			{
				pre[v].insert(u);
			}
		}
	}
	return true;
}
void dfs(int now, int start)
{
	path_now.push_back(now);
	if (now == start)
	{
		if (cost < mini_cost)
		{
			mini_cost = cost;
			path_out.clear();
			path_out = path_now;
		}
		path_now.pop_back();
		return;
	}
	for (set<int>::iterator it = pre[now].begin(); it != pre[now].end(); it++)
	{
		cost += costs[*it][now];
		dfs(*it, start);
		cost -= costs[now][*it];
	}

	path_now.pop_back();
}
int main()
{
	std::ios::sync_with_stdio(false);
	std::cin.tie(0);
	int ta, tm, tl, tc;
	cin >> n >> m >> s >> d;
	for (int i = 0; i < m; i++)
	{
		cin >> ta >> tm >> tl >> tc;
		graph[ta].push_back(Node(tm, tl));
		costs[ta][tm] = tc;
		costs[tm][ta] = tc;
		graph[tm].push_back(Node(ta, tl));
	}
	spfa(s);
	dfs(d, s);
	for (int i = path_out.size() - 1; i >= 0; i--)
	{
		cout << path_out[i] << " ";
	}
	cout << dis[d] << " " << mini_cost << endl;
	return 0;
}
```



#### 1034

main.cpp

```c
#include <iostream>
#include <algorithm>
#include <string>
#include <map>
#include <vector>
#define maxsize 2050
using namespace std;
struct node
{
    int i, val;
    node(int _i, int _val) : i(_i), val(_val){};
};
vector<node> now;
int n, k, weight[maxsize] = {0}, matrx[maxsize][maxsize], vis[maxsize] = {0}, gang = 0;
map<string, int> encode, res;
map<int, string> decode;
void dfs(int index)
{
    vis[index] = 1;
    now.push_back(node(index, weight[index]));
    for (int j = 0; j < n; j++)
    {
        if (matrx[index][j] > 0)
        {
            gang += matrx[index][j];
            if (vis[j] == 0)
                dfs(j);
        }
    }
}
bool cmp(node a, node b)
{
    return a.val >= b.val;
}
int main()
{
    int t, s = 0;
    string a, b;
    cin >> n >> k;
    for (int i = 0; i < n; i++)
    {
        cin >> a >> b >> t;
        if (encode.find(a) == encode.end())
        {
            encode[a] = s;
            decode[s] = a;
            s++;
        }
        if (encode.find(b) == encode.end())
        {
            encode[b] = s;
            decode[s] = b;
            s++;
        }
        matrx[encode[a]][encode[b]] = t;
        weight[encode[a]] += t;
        weight[encode[b]] += t;
    }

    for (int i = 0; i < n; i++)
    {
        if (vis[i] == 0)
        {
            dfs(i);
            sort(now.begin(), now.end(), cmp);
            if (gang > k && now.size() > 2)
                res.insert(make_pair(decode[now[0].i], now.size()));
            now.clear();
            gang = 0;
        }
    }
    map<string, int>::iterator it = res.begin();
    cout << res.size() << endl;
    for (; it !=res.end(); it++)
        cout << it->first << " " << it->second << endl;

    return 0;
}
```



#### 1043

main.cpp

```c
#include <iostream>
#include <vector>
#define max_size 10001
using namespace std;
int n, flag = -1;
vector<int> now_order, origin_order;
struct node
{
    int v;
    node *left, *right;
};
void insert(node *&root, int val)
{
    if (root == NULL)
    {
        root = new node;
        root->left = NULL;
        root->right = NULL;
        root->v = val;
    }
    else
    {
        if (val < root->v)
        {
            insert(root->left, val);
        }
        else
        {
            insert(root->right, val);
        }
    }
}
void bst_pre(node *root)
{
    if (root != NULL)
    {
        now_order.push_back(root->v);
        bst_pre(root->left);
        bst_pre(root->right);
    }
}
void bst_post(node *root)
{
    if (root != NULL)
    {
        bst_post(root->left);
        bst_post(root->right);
		 now_order.push_back(root->v);
    }
}
void mirror_bst_pre(node *root)
{

    if (root != NULL)
    {
		 now_order.push_back(root->v);
        mirror_bst_pre(root->right);
        mirror_bst_pre(root->left);
    }
}
void mirror_bst_post(node *root)
{

    if (root != NULL)
    {
        mirror_bst_post(root->right);
        mirror_bst_post(root->left);
		now_order.push_back(root->v);
    }
}

bool check(bool logFlag)
{
    for (int i = 0; i < n; i++)
    {
        if (!logFlag)
        {
            if (origin_order[i] != now_order[i])
                return false;
        }
        else
        {
            if (i != 0)
                cout << " ";
            cout << now_order[i];
        }
    }
}
int main()
{
    int t;
    node *root = NULL;
    cin >> n;
    for (int i = 0; i < n; i++)
    {
        cin >> t;
        origin_order.push_back(t);
        insert(root, t);
    }
    bst_pre(root);
    if (check(false))
    {
        cout << "YES\n";
        //bst post
        now_order.clear();
        bst_post(root);
        check(true);
    }
    else
    {
        now_order.clear();
        mirror_bst_pre(root);
        if (check(false))
        {
            cout << "YES\n";
            //mirror bst post
            now_order.clear();
            mirror_bst_post(root);
            check(true);
        }
        else
        {
            cout << "NO";
        }
    }
    return 0;
}
```

### 51-100

#### 1053

main.cpp

```c
#include <string>
#include <iostream>
#include <vector>
#include <algorithm>
#include <math.h>
#define max_size 101
using namespace std;
int n, m, s, total;
struct node
{
    int w;
    vector<int> sons;
};
node tree[max_size];
vector<int> path;
bool isRoot[max_size];
bool cmp(int a, int b)
{
    if (tree[a].w != tree[b].w)
    {
        return tree[a].w > tree[b].w;
    }
    else
    {
        return false;
    }
}
void dfs(int root)
{
    total += tree[root].w;
    path.push_back(tree[root].w);
    if (total > s)
    {
        total -= tree[root].w;
        path.pop_back();
        return;
    }
    else if (total == s)
    {
        if (tree[root].sons.size() == 0)
            for (int i = 0; i < path.size(); i++)
            {
                cout << path[i];
                if (i == path.size() - 1)
                {
                    cout << endl;
                }
                else
                    cout << " ";
            }
        total -= tree[root].w;
        path.pop_back();
        return;
    }
    sort(tree[root].sons.begin(), tree[root].sons.end(), cmp);
    for (int i = 0; i < tree[root].sons.size(); i++)
    {
        dfs(tree[root].sons[i]);
    }
    total -= tree[root].w;
    path.pop_back();
}
int main()
{
    cin >> n >> m >> s;
    fill(isRoot, isRoot + n, true);
    for (int i = 0; i < n; i++)
    {
        cin >> tree[i].w;
    }
    for (int i = 0; i < m; i++)
    {
        int a, b, c;
        string sa, sc;
        cin >> sa >> b;
        a = (sa[0] - '0') * 10 + sa[1] - '0';
        for (int j = 0; j < b; j++)
        {
            cin >> sc;
            c = (sc[0] - '0') * 10 + sc[1] - '0';
            tree[a].sons.push_back(c);
            isRoot[c] = false;
        }
    }
    int root;
    for (root = 0; root < n; root++)
    {
        if (isRoot[root])
            break;
    }
    dfs(root);
    return 0;
}
```



#### 1064

main.cpp

```c
#include <iostream>
#include <algorithm>
#define max_size 1001
using namespace std;
int n, flag = 1, origin_order[max_size];
int tree[max_size];
void inOrder(int index)
{
    if (index > n)
    {
        return;
    }
    else
    {
        inOrder(index * 2);
        tree[index] = origin_order[flag++];
        inOrder(index * 2 + 1);
    }
}
bool cmp(int a, int b)
{
    return a < b;
}
int main()
{
    int t;
    cin >> n;
    for (int i = 1; i <= n; i++)
    {
        cin >> t;
        origin_order[i] = t;
    }
    sort(origin_order + 1, origin_order + n + 1, cmp);
    inOrder(1);
    for (int i = 1; i <= n; i++)
    {
        if (i != 1)
            cout << " ";
        cout << tree[i];
    }

    return 0;
}
```





#### 1066

main.cpp

```c
#include <iostream>
#include <math.h>
#define max_size 21
using namespace std;
int n, list[max_size];

struct node
{
    int v, height;
    node *left, *right;
    node()
    {
        v = 0;
        height = 1;
    }
};
node *avl;
int getHeight(node *root)
{
    return root == NULL ? 0 : root->height;
}
void updateHeight(node *root)
{
    root->height = max(getHeight(root->right), getHeight(root->left)) + 1;
}
int getBalanceFactor(node *root)
{
    return getHeight(root->left) - getHeight(root->right);
}

node *newNode(int val)
{
    node *root = new node;
    root->left = root->right = NULL;
    root->v = val;
    root->height = 1;
    return root;
}
void R(node *&root)
{
    node *tmp = root->left;
    root->left = tmp->right;
    tmp->right = root;
    updateHeight(root);
    updateHeight(tmp);
    root = tmp;
}
void L(node *&root)
{
    node *tmp = root->right;
    root->right = tmp->left;
    tmp->left = root;
    updateHeight(root);
    updateHeight(tmp);
    root = tmp;
}
void insert(node *&root, int v)
{
    if (root == NULL)
    {
        root = newNode(v);
        return;
    }
    if (root->v > v)
    {
        insert(root->left, v);
        updateHeight(root);
        if (getBalanceFactor(root) == 2)
        {
            if (getBalanceFactor(root->left) == 1)
            {
                R(root);
            }
            else if (getBalanceFactor(root->left) == -1)
            {
                L(root->left);
                R(root);
            }
        }
    }
    else
    {
        insert(root->right, v);
        updateHeight(root);
        if (getBalanceFactor(root) == -2)
        {
            if (getBalanceFactor(root->right) == 1)
            {
                R(root->right);
                L(root);
            }
            else if (getBalanceFactor(root->right) == -1)
            {
                L(root);
            }
        }
    }
}

int main()
{
    cin >> n;
    avl = NULL;
    for (int i = 0; i < n; i++)
    {
        cin >> list[i];
        insert(avl, list[i]);
    }
    cout << avl->v << endl;
    return 0;
}
```





#### 1079

dfs.cpp

```c
#include <string>
#include <iostream>
#include <vector>
#include <queue>
#include <math.h>
#define max_size 100001
using namespace std;
int n;
struct node
{
    int deepth, data;
    vector<int> sons;
    node()
    {
        deepth = 0;
        data = 0;
    }
};
node tree[max_size];
bool isRoot[max_size];
double p, r, total;
void dfs(int root)
{
    if (tree[root].data > 0)
    {
        total += pow((1.0 + r / 100.0), 0.0 + tree[root].deepth) * p * tree[root].data;
        return;
    }
    for (int i = 0; i < tree[root].sons.size(); i++)
    {
        int son = tree[root].sons[i];
        tree[son].deepth = tree[root].deepth + 1;
        dfs(son);
    }
}
int main()
{
    scanf("%d%lf%lf", &n, &p, &r);
    fill(isRoot, isRoot + n, true);
    for (int i = 0; i < n; i++)
    {
        int m, t;
        scanf("%d", &m);
        if (m == 0)
        {
            scanf("%d", &tree[i].data);
            continue;
        }
        for (int j = 0; j < m; j++)
        {
            scanf("%d", &t);
            tree[i].sons.push_back(t);
            isRoot[t] = false;
        }
    }
    int root;
    for (int i = 0; i < n; i++)
    {
        if (isRoot[i])
        {
            root = i;
            break;
        }
    }
    tree[root].deepth = 0;
    dfs(root);
    printf("%.1lf\n",total);
    return 0;
}
```



#### 1086

main.cpp

```c
#include <string>
#include <iostream>
#include <stack>
#define max_size 31
using namespace std;

int n, pre[max_size], in[max_size];
struct node
{
    int v;
    node *left;
	node*right;
};

void init()
{
    string item;
    cin >> n;
    stack<int> s;
    int a = 0, b = 0, num;
    for (int i = 0; i < 2 * n; i++)
    {
        cin >> item;
        if (item[1] == 'o') //pop
        {
            in[b++] = s.top();
            s.pop();
        }
        else // push
        {
			cin>>num;
            pre[a++] = num;
            s.push(num);
        }
    }
}

node *make(int inleft, int inright, int preleft, int preright)
{
    if (preleft > preright)
        return NULL;
    node *root = new node;
    //root->left  =root->right= NULL;
    root->v = pre[preleft];
    int i = inleft;
    for ( i = inleft; i <= inright; i++)
    {
        if (in[i] == pre[preleft])
            break;
    }
    root->left = make(inleft, i - 1, preleft+1, preleft + i - inleft );
    root->right = make(i + 1, inright, preleft + i - inleft+1, preright);

    return root;
}
void postOrder(node *root)
{
    if (root == NULL)
        return;
    postOrder(root->left);
    postOrder(root->right);
    cout << root->v;
    if (n > 1)
        cout << " ";
    --n;
}
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    init();
	node *root = make(0, n - 1, 0, n - 1);
    postOrder(root);
    return 0;
}
```

#### 1088

main.cpp

```c
#include <iostream>
#include <string>
#include <math.h>
using namespace std;
string s;
struct num
{
    bool opt;
    long son, mon;
};
num a, b;
long gcd(long a, long b)
{
    if (a % b == 0)
        return b;
    return gcd(b, a % b);
}
void make()
{
    long i = 0;
    if (!isdigit(s[0]))
    {
        a.opt = false;
        i++;
    }
    else
        a.opt = true;
    a.son = s[i++] - '0';
    ++i;
    a.mon = s[i++] - '0';
    i++;

    if (!isdigit(s[i]))
    {
        b.opt = false;
        i++;
    }
    else
        b.opt = true;
    b.son = s[i++] - '0';
    ++i;
    b.mon = s[i++] - '0';
    i++;
}
void print(long x, long y)
{
    long gc = gcd(abs(x), y);
    x = x / gc;
    y /= gc;
    long left = abs(y) == 1 ? x / y : 0;
    x = abs(y) == 1 ? 0 : x;
    while (abs(x) > y && abs(y) != 1)
    {
        if (x > 0)
        {
            x -= y;
            left++;
        }
        else if (x < 0)
        {
            x += y;
            left--;
        }
    }
    if (x == 0 && left == 0)
    {
        cout << 0;
        return;
    }
    if (left != 0)
    {
        x = abs(x);
    }
    if (left > 0)
    {
        if (x == 0)
            cout << left;
        else
            cout << left << " " << x << "/" << y;
    }
    else if (left == 0)
    {
        if (x > 0)
            cout << x << "/" << y;
        else
            cout << "(" << x << "/" << y << ")";
    }
    else
    {
        if (x == 0)
            cout << "(" << left << ")";
        else
            cout << "(" << left << " " << x << "/" << y << ")";
    }
}
void addAndMin(long x1, long x2, long y1, bool isAdd)
{
    long x, y;
    if (isAdd)
        x = x1 + x2;
    else
        x = x1 - x2;
    print(x1, y1);
    cout << (isAdd ? " + " : " - ");
    print(x2, y1);
    cout << " = ";
    print(x, y1);
    cout << endl;
}
void chenAndChu(long x1, long x2, long y1, long y2, bool isChen)
{
    long x, y;
    if (x2 == 0 && !isChen)
    {
        print(x1, y1);
        cout << (" / ");
        print(x2, y2);
        cout << " = ";
        cout << "Inf";
        return;
    }
    else
    {
        if (isChen)
        {
            x = x1 * x2;
            y = y1 * y2;
        }
        else
        {
            x = x1 * y2;
            y = y1 * x2;
            x = y > 0 ? x : (x * -1);
            y = abs(y);
        }
    }
    print(x1, y1);
    cout << (isChen ? " * " : " / ");
    print(x2, y2);
    cout << " = ";
    print(x, y);
    cout << endl;
}
void opt()
{
    long x1, y, x2, gc;
    x1 = a.son * b.mon;
    x2 = a.mon * b.son;
    y = a.mon * b.mon;
    if (!a.opt)
        x1 = -x1;
    if (!b.opt)
        x2 = -x2;
    addAndMin(x1, x2, y, true);
    addAndMin(x1, x2, y, false);
    x1 = !a.opt ? (a.son * -1) : a.son;
    x2 = !b.opt ? (b.son * -1) : b.son;
    chenAndChu(x1, x2, a.mon, b.mon, true);
    chenAndChu(x1, x2, a.mon, b.mon, false);
}
int main()
{

    getline(cin, s);
    make();
    opt();
    return 0;
}
```



tempCodeRunnerFile.cpp

```c
#include <iostream>
#include <string>
#include <math.h>
using namespace std;
string s;
struct num
{
    bool opt;
    int son, mon;
};
num a, b;
int gcd(int a, int b)
{
    if (a % b == 0)
        return b;
    return gcd(b, a % b);
}
void make()
{
    int i = 0;
    if (!isdigit(s[0]))
    {
        a.opt = false;
        i++;
    }
    else
        a.opt = true;
    a.son = s[i++] - '0';
    ++i;
    a.mon = s[i++] - '0';
    i++;

    if (!isdigit(s[i]))
    {
        b.opt = false;
        i++;
    }
    else
        b.opt = true;
    b.son = s[i++] - '0';
    ++i;
    b.mon = s[i++] - '0';
    i++;
}
void print(int x, int y)
{
    int gc = gcd(abs(x), y);
    x = x / gc;
    y /= gc;
    int left = abs(y) == 1 ? x / y : 0;
    x = abs(y) == 1 ? 0 : x;
    while (abs(x) > y && abs(y) != 1)
    {
        if (x > 0)
        {
            x -= y;
            left++;
        }
        else if (x < 0)
        {
            x += y;
            left--;
        }
    }
    if (x == 0 && left == 0)
    {
        cout << 0;
        return;
    }
    if (left != 0)
    {
        x = abs(x);
    }
    if (left > 0)
    {
        if (x == 0)
            cout << left;
        else
            cout << left << " " << x << "/" << y;
    }
    else if (left == 0)
    {
        if (x > 0)
            cout << x << "/" << y;
        else
            cout << "(" << x << "/" << y << ")";
    }
    else
    {
        if (x == 0)
            cout << "(" << left << ")";
        else
            cout << "(" << left << " " << x << "/" << y << ")";
    }
}
void addAndMin(int x1, int x2, int y1, bool isAdd)
{
    int x, y;
    if (isAdd)
        x = x1 + x2;
    else
        x = x1 - x2;
    print(x1, y1);
    cout << (isAdd ? " + " : " - ");
    print(x2, y1);
    cout << " = ";
    print(x, y1);
    cout << endl;
}
void chenAndChu(int x1, int x2, int y1, int y2, bool isChen)
{
    int x, y;
    if (x2 == 0 && !isChen)
    {
        print(x1, y1);
        cout << (" / ");
        print(x2, y2);
        cout << " = ";
        cout << "Inf";
        return;
    }
    else
    {
        if (isChen)
        {
            x = x1 * x2;
            y = y1 * y2;
        }
        else
        {
            x = x1 * y2;
            y = y1 * x2;
            x = y > 0 ? x : (x * -1);
            y = abs(y);
        }
    }
    print(x1, y1);
    cout << (isChen ? " * " : " / ");
    print(x2, y2);
    cout << " = ";
    print(x, y);
    cout << endl;
}
void opt()
{
    int x1, y, x2, gc;
    x1 = a.son * b.mon;
    x2 = a.mon * b.son;
    y = a.mon * b.mon;
    if (!a.opt)
        x1 = -x1;
    if (!b.opt)
        x2 = -x2;
    addAndMin(x1, x2, y, true);
    addAndMin(x1, x2, y, false);
    x1 = !a.opt ? (a.son * -1) : a.son;
    x2 = !b.opt ? (b.son * -1) : b.son;
    chenAndChu(x1, x2, a.mon, b.mon, true);
    chenAndChu(x1, x2, a.mon, b.mon, false);
}
int main()
{

    getline(cin, s);
    make();
    opt();
    return 0;
}
```

#### 1089

main.cpp

```c
#include <iostream>
#include <algorithm>
#define maxsize 105
using namespace std;
int n, origin[maxsize], sec[maxsize];
int main()
{
    int p, index, j;
    cin >> n;
    for (int i = 0; i < n; i++)
        cin >> origin[i];
    for (int i = 0; i < n; i++)
        cin >> sec[i];
    p = 1;
    while (p < n && sec[p - 1] <= sec[p])
        p++;
    index = p;
    while (p < n && origin[p] == sec[p])
        p++;
    if (p == n)
    {
        cout << "Insertion Sort" << endl;
        sort(origin, origin + index + 1);
    }
    else
    {
        cout << "Merge Sort" << endl;
        index = 1;
        bool flag = true;
        while (flag)
        {
            flag = false;
            for (int i = 0; i < n; i++)
                if (sec[i] != origin[i])
                {
                    flag = true;
                    break;
                }
            index = index * 2;
            for (j = 0; j < n / index; j++)
                sort(origin + j * index, origin + (j + 1) * index);
            sort(origin + n / index * index, origin + n);
        }
    }
    for (int i = 0; i < n; i++)
    {
        if (i != 0)
            cout << " " << origin[i];
        else
            cout << origin[i];
    }
    return 0;
}
/*
10
3 1 2 8 7 5 9 4 0 6
1 3 2 8 5 7 4 9 0 6
*/
```

#### 1090

ls.cpp

```c
#include <iostream>
#include <map>
#include <vector>
#include <math.h>
#include <queue>
using namespace std;
int n, maxi_deepth = 0, num = 0;

struct node
{
    int v, deepth;
};
node root;
map<int, vector<node>> tree;
double price, percent;
void layerOrder()
{
    queue<node> q;
    root.deepth = 0;
    q.push(root);

    while (!q.empty())
    {
        node f = q.front();
        q.pop();
        vector<node> item = tree[f.v];
        for (int i = 0; i < item.size(); i++)
        {
            item[i].deepth = f.deepth + 1;
            q.push(item[i]);
        }
        if (f.deepth > maxi_deepth)
        {
            num = 1;
            maxi_deepth = f.deepth;
        }
        else if (f.deepth == maxi_deepth)
    }
    printf("%.2lf %d\n", price * pow((1.0 + percent / 100.0), maxi_deepth), num);
}
int main()
{
    int tmp;
    node t;
    scanf("%d%lf%lf", &n, &price, &percent);
    for (int i = 0; i < n; i++)
    {
        scanf("%d", &tmp);
        t.v = i;
        if (tmp == -1)
            root.v = i;
        else
            tree[tmp].push_back((t));
    }
    layerOrder();
    return 0;
}
```

#### 1098

main.cpp

```c
#include <iostream>
#include <algorithm>
#define max_size 101
using namespace std;
int n;
int origin[max_size], uncheck[max_size];
void quickSort(int index)
{
    int tmp = uncheck[index];
    for (int j = index; j >= 1; j--)
    {
        if (tmp < uncheck[j - 1])
            uncheck[j] = uncheck[j - 1];
        else
        {
            uncheck[j] = tmp;
            break;
        }
        if (j == 1)
            uncheck[0] = tmp;
    }
}
void downAdjust(int low, int high)
{

    int i = low, j = 2 * i;
    while (j <= high)
    {
        if ((j + 1) <= high && uncheck[j] < uncheck[j + 1])
            j = j + 1;
        if (uncheck[j] > uncheck[i])
        {
            swap(uncheck[j], uncheck[i]);
            i = j;
            j = 2 * i;
        }
        else
            break;
    }
}

int main()
{
    int tmp, i;
    cin >> n;
    for (i = 1; i <= n; i++)
        cin >> origin[i];
    for (i = 1; i <= n; i++)
        cin >> uncheck[i];
    i = 2;
    while (i <= n && uncheck[i] >= uncheck[i - 1])
        ++i;
    tmp = i;
    while (i <= n && origin[i] == uncheck[i])
        ++i;
    if (i == n + 1)
    {
        cout << "Insertion Sort" << endl;
        quickSort(tmp);
    }
    else
    {
        i = n;
        cout << "Heap Sort" << endl;
        while (i >= 2 && uncheck[i] > uncheck[1])
            --i;
        swap(uncheck[1], uncheck[i]);
        downAdjust(1, i - 1);
    }
    for (i = 1; i <= n; i++)
    {
        cout << (i != 1 ? " " : "");
        cout << uncheck[i];
    }
    return 0;
}
```

#### 1099

main.cpp

```c
#include <iostream>
#include <algorithm>
#include <queue>
#define max_size 101
using namespace std;
int n, val[max_size], index = 0;
struct node
{
    int v, left, right;
};
node tree[max_size];
void inOrder(int root)
{
    if (root != -1)
    {
        inOrder(tree[root].left);
        tree[root].v = val[index++];
        inOrder(tree[root].right);
    }
}
void levelOrder()
{
    queue<int> q;
    q.push(0);
    while (!q.empty())
    {
        int root = q.front();
        q.pop();
        cout << tree[root].v;
        if (tree[root].left != -1)
            q.push(tree[root].left);
        if (tree[root].right != -1)
            q.push(tree[root].right);
        if (q.size() != 0)
            cout << " ";
    }
}
int main()
{
    cin >> n;
    for (int i = 0; i < n; i++)
        cin >> tree[i].left >> tree[i].right;
    for (int i = 0; i < n; i++)
        cin >> val[i];
	sort(val,val+n);
    inOrder(0);
    levelOrder();
    return 0;
}
```

#### 1100

main.cpp

```c
#include <iostream>
#include <string>
#include <map>
using namespace std;
string ge[13] = {
    "tret",
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jly",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
},
       shi[13] = {"tret", "tam",  "hel",  "maa",  "huh",    "tou",   "kes",    "hei",  "elo",    "syy",  "lok",    "mer",   "jou",};
int n;
map<string, int> de_ge, de_shi;
void print(string s)    
{
    if (isdigit(s[0])) //数字
    {
        int num = stoi(s), ige, ishi;
        ige = num % 13;
        ishi = num / 13;
        cout << (ishi == 0 ? "" : shi[ishi]) << (ishi == 0 || ige == 0 ? "" : " ") << (ige == 0 ? "" : ge[ige]) << (ige == 0 && ishi == 0 ? ge[0] :"" ) << endl;
    }
    else //字母
    {
        int out = 0;
        if (s.size() == 3)
        {
            if (de_shi.find(s.substr(0, 3)) == de_shi.end())
                out = de_ge[s.substr(0, 3)];
            else
                out = de_shi[s.substr(0, 3)] * 13;
        }
        else
            out = de_ge[s.substr(4)] + de_shi[s.substr(0, 3)] * 13;
        cout << out << endl;
    }
}
int main()
{
    for (int i = 0; i < 13; i++)
        de_ge[ge[i]] = i;
    for (int i = 0; i < 13; i++)
        de_shi[shi[i]] = i;

    string s;
    cin >> n;
    getchar();
    for (int i = 0; i < n; i++)
    {
        getline(cin, s);
        print(s);
    }
    return 0;
}
```

### 101-150+

#### 1102

main.cpp

 ```c
#include <string>
#include <iostream>
#include <vector>
#include <queue>
#define max_size 11
using namespace std;
bool isRoot[max_size];
int n, index;
struct node
{
    int v, left, right;
    node()
    {
        v = -1;
        left = -1;
        right = -1;
    }
};
node tree[max_size];
void postOrder(node &root)
{
    if (root.v == -1)
    {
        return;
    }
    if (root.left != -1)
        postOrder(tree[root.left]);
    if (root.right != -1)
        postOrder(tree[root.right]);
    int tmp = root.right;
    root.right = root.left;
    root.left = tmp;
    return;
}
void level(int root)
{
    queue<int> q;
    q.push(root);
    while (!q.empty())
    {
        int now = q.front();
        q.pop();
        if (tree[now].left != -1)
            q.push(tree[now].left);
        if (tree[now].right != -1)
            q.push(tree[now].right);
		cout<<tree[now].v;
        if (q.size() != 0)
        {
            cout << " ";
        }
    }
}
void inOrder(node root)
{
    if (root.v == -1)
    {
        return;
    }
    if (root.left != -1)
        inOrder(tree[root.left]);
    cout << root.v;
    if (index < n)
        cout << " ";
    ++index;
    if (root.right != -1)
        inOrder(tree[root.right]);
}
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cin >> n;
    string s;
    fill(isRoot, isRoot + n, true);
    for (int i = 0; i < n; i++)
    {

        cin >> s;
        tree[i].v = i;
        if (s[0] != '-')
        {
            int item = s[0] - '0';
            isRoot[item] = false;
            tree[i].left = item;
        }
        cin >> s;
        if (s[0] != '-')
        {
            int item = s[0] - '0';
            isRoot[item] = false;
            tree[i].right = item;
        }
    }
    int root;
    for (int i = 0; i < n; i++)
    {
        if (isRoot[i])
        {
            root = i;
            break;
        }
    }
    postOrder(tree[root]);
    index = 1;
    level(root);
	cout<<endl;
    inOrder(tree[root]);
    return 0;
}
 ```
#### 1106

dfs.cpp

```c
#include <string>
#include <iostream>
#include <vector>
#include <math.h>
#define max_size 100005
using namespace std;
struct node
{
    int deepth ;
    vector<int> sons;
	node (){
		deepth = 0;
	}
};
int n, max_deepth = max_size, maxi = 0;
double p, r;
bool isRoot[max_size];
node tree[max_size];
void dfs(int root)
{
    if (tree[root].sons.size() == 0)
    {
        if (tree[root].deepth < max_deepth)
        {
            max_deepth = tree[root].deepth;
            maxi = 1;
        }
        else if (tree[root].deepth == max_deepth)
        {
            maxi++;
        }
		return ;
    }
    for (int i = 0; i < tree[root].sons.size(); i++)
    {
        int item = tree[root].sons[i];
        tree[item].deepth = tree[root].deepth + 1;
        dfs(item);
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> p >> r;
    int t, f;
    fill(isRoot, isRoot + n, true);
    for (int i = 0; i < n; i++)
    {
        cin >> t;
        for (int j = 0; j < t; j++)
        {
            cin >> f;
            tree[i].sons.push_back(f);
            isRoot[f] = false;
        }
    }
    int root;
    for (root = 0; root < n; root++)
    {
        if (isRoot[root])
            break;
    }
    dfs(root);
    double res = pow((1.0 + r / 100.0), max_deepth) * p;
    printf("%.4lf %d", res, maxi);
    return 0;
}
```
#### 1107

main.cpp

```c
#include <iostream>
#include <math.h>
#include <string>
#include <algorithm>
#include <vector>
#define max_size 1001
using namespace std;
vector<int> list[max_size], out;
int n, father[max_size], res[max_size];
int findFather(int x)
{
    int t = x;
    while (x != father[x])
    {
        x = father[x];
    }
    while (t != father[t])
    {
        int z = t;
        t = father[t];
        father[z] = x;
    }
    return x;
}
void Union(int a, int b)
{
    int fa = findFather(a), fb = findFather(b);
    if (fa != fb)
    {
        father[fb] = fa;
    }
}
int main()
{
    int tmp, t;
    string s;
    cin >> n;
    for (int i = 1; i <max_size; i++)
    {
        father[i] = i;
    }
    for (int i = 1; i <= n; i++)
    {
        cin >> tmp >> s;
        for (int j = 0; j < tmp; j++)
        {
            cin >> t;
            list[t].push_back(i);
        }
    }
    for (int i = 1; i < max_size; i++)
    {
        int f = list[i].size() - 1;
        for (int j = 0; j < f; j++)
            Union(list[i][j], list[i][j + 1]);
    }
    for (int i = 1; i <= n; i++)
    {
        res[findFather(i)]++;
    }
    for (int i = 1; i <= n; i++)
    {
        if (res[i] > 0)
            out.push_back(res[i]);
    }
    sort(out.begin(), out.end());
    for (int i = out.size() - 1; i >= 0; i--)
    {
        cout << out[i];
        if (i != 0)
            cout << " ";
    }
    return 0;
}
```
#### 1111

main.cpp

```c
#include <iostream>
#include <algorithm>
#include <vector>
#define maxsize 505
#define INF 0x3ffffff
using namespace std;
int n, m, s, e, dis[maxsize], times[maxsize],
    lenpathMaxi = INF, lenpathNow = 0,
    dispre[maxsize],
    timepathMaxi = INF, timepathNow = 0,
    matrx_len[maxsize][maxsize], matrx_time[maxsize][maxsize];
bool vis[maxsize];
vector<int> lenpath, out, timepath, timeout;

void dij_d()
{
    fill(vis, vis + n, false);
    fill(dis, dis + n, INF);
    for (int i = 0; i < n; i++)
        dispre[i] = i;

    dis[s] = 0;

    for (int j = 0; j < n; j++)
    {
        int u = -1, mini = INF;
        for (int i = 0; i < n; i++)
        {
            if (dis[i] < mini && !vis[i])
            {
                u = i;
                mini = dis[i];
            }
        }
        if (u == -1)
            break;
        vis[u] = true;
        for (int i = 0; i < n; i++)
        {
            if (matrx_len[u][i] > 0 && !vis[i])
            {
                if (dis[i] > (matrx_len[u][i] + dis[u]))
                {
                    dis[i] = matrx_len[u][i] + dis[u];
                    // dispre[i] = u;
                }
                // else if (dis[i] == (matrx[u][i].lenght + dis[u]) &&)
                // {
                // }
            }
        }
    }
}
int getTime(vector<int> a)
{
    int time = 0;
    for (int i = 0; i < a.size() - 1; i++)
    {
        time += matrx_time[a[i]][a[i + 1]];
    }
    return time;
}
void dfs(int index)
{
    if (index == e)
    {
        if (lenpathNow < lenpathMaxi)
        {
            lenpathMaxi = lenpathNow;
            out = lenpath;
        }
        else if (lenpathNow == lenpathMaxi)
        {
            int a = getTime(lenpath), b = getTime(out);
            if (a < b)
                out = lenpath;
        }
        return;
    }
    vis[index] = true;
    for (int i = 0; i < n; i++)
    {
        if (matrx_len[index][i] > 0 && !vis[i] && lenpathNow + matrx_len[index][i] <= timepathMaxi)
        {
            vis[i] = true;
            lenpath.push_back(i);
            lenpathNow += matrx_len[index][i];
            dfs(i);
            lenpathNow -= matrx_len[index][i];
            lenpath.pop_back();
            vis[i] = false;
        }
    }
}
void dij_t()
{
    fill(vis, vis + n, false);
    fill(times, times + n, INF);

    times[s] = 0;

    for (int j = 0; j < n; j++)
    {
        int u = -1, mini = INF;
        for (int i = 0; i < n; i++)
        {
            if (times[i] < mini && !vis[i])
            {
                u = i;
                mini = times[i];
            }
        }
        if (u == -1)
            break;
        vis[u] = true;
        for (int i = 0; i < n; i++)
        {
            if (matrx_time[u][i] > 0 && times[i] > (matrx_time[u][i] + times[u]) && !vis[i]) //==
            {
                times[i] = matrx_time[u][i] + times[u];
            }
        }
    }
}
void dfs_t(int index)
{
    if (index == e)
    {
        if (timepathNow < timepathMaxi)
        {
            timepathMaxi = timepathNow;
            timeout = timepath;
        }
        else if (timepathNow == timepathMaxi)
        {
            int a = timepath.size(), b = timeout.size();
            if (a < b)
                timeout = timepath;
        }
        return;
    }
    vis[index] = true;
    for (int i = 0; i < n; i++)
    {
        if (matrx_len[index][i] > 0 && !vis[i] && timepathNow + matrx_time[index][i] <= timepathMaxi)
        {
            vis[i] = true;
            timepath.push_back(i);
            timepathNow += matrx_time[index][i];
            dfs_t(i);
            timepathNow -= matrx_time[index][i];
            timepath.pop_back();
            vis[i] = false;
        }
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> m;
    int a, b, c, l, t;
    Node node;
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b >> c >> l >> t;
        matrx_len[a][b] = l;
        matrx_time[a][b] = t;
        if (c != 1)
        {
            matrx_len[b][a] = l;
            matrx_time[b][a] = t;
        }
    }
    cin >> s >> e;
    dij_d();
    fill(vis, vis + n, false);
    dfs(s);
    dij_t();
    fill(vis, vis + n, false);
    dfs_t(s);
    if (out.size() == timeout.size())
    {
        for (int i = 0; i < out.size(); i++)
        {
            if (out[i] != timeout[i])
            {
                cout << "Distance = " << lenpathMaxi << ": " << s;
                for (int j = 0; j < out.size(); j++)
                    cout << " -> " << out[j];
                cout << endl
                     << "Time = "
                     << timepathMaxi << ": " << s;
                for (int j = 0; j < timeout.size(); j++)
                    cout << " -> " << timeout[j];
                return 0;
            }
        }
        cout << "Distance = " << lenpathMaxi << "; "
             << "Time = " << timepathMaxi << ": " << s;
        for (int i = 0; i < out.size(); i++)
        {
            cout << " -> " << out[i];
        }
    }
    else
    {
        cout << "Distance = " << lenpathMaxi << ": " << s;
        for (int i = 0; i < out.size(); i++)
            cout << " -> " << out[i];
        cout << endl
             << "Time = "
             << timepathMaxi << ": " << s;
        for (int i = 0; i < timeout.size(); i++)
            cout << " -> " << timeout[i];
        return 0;
    }
}
```
#### 1112

main.cpp

```c
#include <iostream>
#include <algorithm>
#include <string>
#include <vector>
#include <unordered_map>
#define maxsize 300
using namespace std;
int n;
string s, out;
bool vis[maxsize] = {false};
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> s;
    unordered_map<char, int> times;
    char ch = '!';
    int tmp = 0;
    vector<char> keys;
    for (int i = 0; i < s.size(); i++)
    {
        if (ch != s[i])
        {
            ch = s[i];
            tmp = 1;
        }
        else
        {
            tmp++;
        }
        if (tmp == n)
        {
            times[ch]++;
            ch = '!';
        }
    }
    ch = '!';
    for (int i = 0; i < s.size(); i++)
    {
        if (times[s[i]] < 2)
        {
            ch = s[i];
            out.push_back(s[i]);
            // cout << s[i];
        }
        else
        {
            if (vis[s[i]] == false)
            {
                cout << s[i];
                vis[s[i]] = true;
            }
            if (ch != s[i])
            {
                // cout << s[i];
                out.push_back(s[i]);
                int j = i;
                while (j < (i + n) && j < s.size() && s[j] == s[i])
                    ++j;
                if (j == (i + n))
                    i = i + n - 1;
            }
        }
    }
    cout << endl
         << out;

    return 0;
}
```
#### 1113

main.cpp

```c
#include <iostream>
#include <algorithm>
#include <math.h>
#define maxsize 100005
using namespace std;
int n, list[maxsize];
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    int tmp = 0;
    for (int i = 0; i < n; i++)
        cin >> list[i];
    sort(list, list + n);
    if (n % 2 == 0)
        cout << "0 ";
    else
        cout << "1 ";
    for (int i = 0; i < (n / 2); i++)
        tmp += list[i];
    for (int i = (n / 2); i < n; i++)
        tmp -= list[i];
    cout << abs(tmp) << endl;
    return 0;
}
```
#### 1115

main.cpp

```c
#include <iostream>
#include <unordered_map>
#include <string>
#include <math.h>
#define maxsize 20500
using namespace std;
int n, m, maxi = 0, list[maxsize] = {0};
struct Node
{
    int v, height;
    Node *left, *right;
};
Node *newNode(int height, int v)
{
    Node *node = new Node;
    node->left = node->right = NULL;
    node->v = v;
    if (height > maxi)
        maxi = height;
    list[height]++;
    node->height = height;
}
void insert(Node *&node, int v, int height)
{
    if (node == NULL)
        node = newNode(height, v);
    else if (v <= node->v)
        insert(node->left, v, height + 1);
    else
        insert(node->right, v, height + 1);
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    int tmp;
    Node *root = NULL;
    for (int i = 0; i < n; i++)
    {
        cin >> tmp;
        insert(root, tmp, 1);
    }
    cout << list[maxi] << " + " << list[maxi - 1] << " = " << (list[maxi] + list[maxi - 1]);
    return 0;
}
```
#### 1116

main.cpp

```c
#include <iostream>
#include <unordered_map>
#include <string>
#include <math.h>
#define maxsize 205
using namespace std;
int n, m, maxi = 0;
bool isPrime(int val)
{
    for (int i = 2; i <= sqrt(val); i++)
        if (val % i == 0)
            return false;
    return true;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    string s;
    unordered_map<string, int> rank;
    for (int i = 0; i < n; i++)
    {
        cin >> s;
        rank[s] = i;
    }
    cin >> n;
    for (int i = 0; i < n; i++)
    {
        cin >> s;
        if (rank.find(s) == rank.end())
            cout << s << ": Are you kidding?" << endl;
        else if (rank[s] == -1)
            cout << s << ": Checked" << endl;
        else
        {
            if (rank[s] == 0)
                cout << s << ": Mystery Award" << endl;
            else if (isPrime(rank[s]+1))
                cout << s << ": Minion" << endl;
            else
                cout << s << ": Chocolate" << endl;
            rank[s] = -1;
        }
    }

    return 0;
}
```
#### 1117

main.cpp

```c
#include <iostream>
#include <algorithm>
#define maxsize 205
using namespace std;
int n, m, list[1000005];
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    for (int i = 0; i < n; i++)
        cin >> list[i];
    sort(list, list + n, greater<int>());
    int i = 0;
    while (i < n && list[i] > i + 1)
        i++;
    cout<<i;
    return 0;
}
```
#### 1118

main.cpp

```c
#include <iostream>
#include <unordered_map>
#include <set>
#include <vector>
#define maxsize 205
using namespace std;
int n, m, maxi = 0;
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    int a, b;
    unordered_map<int, int> birds;
    unordered_map<int, vector<int>> tree;
    set<int> trees;
    for (int i = 0; i < n; i++)
    {
        cin >> m;
        vector<int> list(m);
        for (int j = 0; j < m; j++)
        {
            cin >> list[j];
            if (list[j] > maxi)
                maxi = list[j];
        }
    }
    cout << trees.size() << " " << maxi << endl;
    cin >> m;
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b;
        cout << "Yes" << endl;
        cout << "No" << endl;
    }

    return 0;
}
```
#### 1120

main.cpp

```c
#include <iostream>
#include <set>
#define maxsize 205
using namespace std;
int n, m, tmp;
set<int> out;
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    for (int i = 0; i < n; i++)
    {
        cin >> m;
        tmp = 0;
        while (m > 0)
        {
            tmp += m % 10;
            m /= 10;
        }
        out.insert(tmp);
    }
    cout << out.size() << endl;
    for (set<int>::iterator it = out.begin(); it != out.end(); it++)
    {
        if (it != out.begin())
            cout << " ";
        cout << *it;
    }

    return 0;
}
```
#### 1121

main.cpp

```c
#include <iostream>
#include <vector>
#include <set>
#include <string>
#include <unordered_map>
#define maxsize 205
using namespace std;
int n, m;
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    string a, b;
    unordered_map<string, string> coupe;
    set<string> visitor, out;
    for (int i = 0; i < n; i++)
    {
        cin >> a >> b;
        coupe[a] = b;
        coupe[b] = a;
    }
    cin >> m;
    for (int i = 0; i < m; i++)
    {
        cin >> a;
        visitor.insert(a);
    }
    for (set<string>::iterator it = visitor.begin(); it != visitor.end(); it++)
    {
        if (coupe.find(*it) != coupe.end())
        {
            if (visitor.find(coupe[*it]) != visitor.end())
            {
                continue;
            }
        }
        out.insert(*it);
    }
    cout << out.size() << endl;
    for (set<string>::iterator it = out.begin(); it != out.end(); it++)
    {
        if (it != out.begin())
            cout << " ";
        cout << *it;
    }
    return 0;
}
```
#### 1122

main.cpp

```c
#include <iostream>
#include <vector>
#include <unordered_map>
#define maxsize 205
using namespace std;
int n, m, matrx[maxsize][maxsize] = {0};
bool vis[maxsize] = {false};
vector<int> path;
unordered_map<int, int> times;
void judge()
{
    times.clear();
    fill(vis, vis + n + 1, false);
    if (path[0] != path[path.size() - 1])
    {
        cout << "NO" << endl;
        return;
    }
    times[path[0]] = 1;
    for (int i = 1; i < path.size(); i++)
    {
        if (matrx[path[i]][path[i - 1]] != 1)
        {
            cout << "NO" << endl;
            return;
        }
        else
        {
            times[path[i]]++;
        }
    }
    if (times.size() != n || times[path[0]] != 2)
    {
        cout << "NO" << endl;
        return;
    }
    else
    {
        for (int i = 1; i < path.size() - 2; i++)
        {
            if (times[path[i]] > 1)
            {
                cout << "NO" << endl;
                return;
            }
        }
        cout << "YES" << endl;
        return;
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> m;
    int a, b;
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b;
        matrx[a][b] = matrx[b][a] = 1;
    }
    cin >> m;

    for (int i = 0; i < m; i++)
    {
        int k;
        cin >> k;
        path.clear();

        for (int j = 0; j < k; j++)
        {
            cin >> a;
            path.push_back(a);
        }
        judge();
    }

    return 0;
}
```
#### 1123

main.cpp

```c
#include <iostream>
#include <vector>
#include <queue>
#include <math.h>
#define maxsize 205
using namespace std;
struct Node
{
    int v, height;
    Node *left, *right;
};
int n, m;
Node *newNode(int v)
{
    Node *node = new Node;
    node->v = v;
    node->height = 1;
    node->left = node->right = NULL;
    return node;
}
int getH(Node *node)
{
    if (node == NULL)
        return 0;
    return node->height;
}
void updateH(Node *node)
{
    node->height = max(getH(node->left), getH(node->right)) + 1;
}
void R(Node *&node)
{
    Node *tmp = node->left;
    node->left = tmp->right;
    tmp->right = node;
    updateH(node);
    updateH(tmp);
    node = tmp;
}
void L(Node *&node)
{
    Node *tmp = node->right;
    node->right = tmp->left;
    tmp->left = node;
    updateH(node);
    updateH(tmp);
    node = tmp;
}
int getBalance(Node *node)
{
    return getH(node->left) - getH(node->right);
}
void insert(Node *&node, int v)
{
    if (node == NULL)
    {
        node = newNode(v);
        return;
    }
    if (node->v > v)
    {
        insert(node->left, v);
        updateH(node);
        if (getBalance(node) == 2)
        {
            if (getBalance(node->left) == 1)
                R(node);
            else if (getBalance(node->left) == -1)
            {
                L(node->left);
                R(node);
            }
        }
    }
    else
    {
        insert(node->right, v);
        updateH(node);
        if (getBalance(node) == -2)
        {
            if (getBalance(node->right) == -1)
                L(node);
            else if (getBalance(node->right) == 1)
            {
                R(node->right);
                L(node);
            }
        }
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    Node *root = NULL, *tmp;
    for (int i = 0; i < n; i++)
    {
        cin >> m;
        insert(root, m);
    }
    queue<Node *> q;
    q.push(root);
    bool flag = true;
    int isC = -1;
    while (!q.empty())
    {
        tmp = q.front();
        if (flag)
            flag = false;
        else
            cout << " ";
        cout << tmp->v;
        q.pop();
        if (isC == 0 && (tmp->left != NULL || tmp->right != NULL))
            isC = 1;
        if (tmp->right == NULL && isC == -1)
            isC = 0;
        if (tmp->left != NULL)
            q.push(tmp->left);
        if (tmp->right != NULL)
            q.push(tmp->right);
    }
    if (isC == 0)
        cout << endl
             << "YES" << endl;
    else
        cout << endl
             << "NO" << endl;
    return 0;
}
```
#### 1124

main.cpp

```c
#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
#define maxsize 1005
using namespace std;
int n, m, s;
string ss;
unordered_map<string, bool> list;
string out[maxsize];
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> m >> s;
    for (int i = 1; i <= n; i++)
    {
        cin >> ss;
        out[i] = ss;
    }
    if (n < s)
        cout << "Keep going..." << endl;
    else
    {
        cout << out[s] << endl;
        list[out[s]] = true;
        int i = s + m;
        while (i <= n)
        {
            if (list.find(out[i]) == list.end())
            {
                cout << out[i] << endl;
                list[out[i]] = true;
            }
            else
            {
                i++;
                continue;
            }
            i = i + m;
        }
    }

    return 0;
}
```
#### 1125

main.cpp

```c
#include <iostream>
#include <queue>
#include <math.h>
#define maxsize 505
using namespace std;
int n, m;
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    priority_queue<double, vector<double>, greater<double>> heap;
    for (int i = 0; i < n; i++)
    {
        cin >> m;
        heap.push(m);
    }
    double a, b;
    while (heap.size() > 1)
    {
        a = heap.top();
        heap.pop();
        b = heap.top();
        heap.pop();
        a = (a + b) / 2.0;
        heap.push(a);
    }
    a = heap.top();
    cout << floor(a) << endl;
    return 0;
}
```
#### 1126

main.cpp

```c
#include <iostream>
#include <deque>
#define maxsize 505
using namespace std;
int n, m, degree[maxsize], matrx[maxsize][maxsize];
bool vis[maxsize] = {false};
void dfs(int index)
{
    vis[index] = true;
    for (int i = 1; i <= n; i++)
        if (matrx[index][i] > 0 && vis[i] == false)
            dfs(i);
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> m;
    int a, b;
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b;
        degree[a]++;
        degree[b]++;
        matrx[a][b] = matrx[b][a] = 1;
    }
    a = 0;
    for (int i = 1; i <= n; i++)
    {
        if (i != 1)
            cout << " ";
        cout << degree[i];
        if (degree[i] % 2 != 0)
            a++;
    }
    cout << endl;
    m = 0;
    for (int i = 1; i <= n; i++)
        if (vis[i] == false)
        {
            dfs(i);
            m++;
        }

    if (m > 1)
        cout << "Non-Eulerian" << endl;
    else if (a == 0)
        cout << "Eulerian" << endl;
    else if (a == 2)
        cout << "Semi-Eulerian" << endl;
    else
        cout << "Non-Eulerian" << endl;

    return 0;
}
```
#### 1127

main.cpp

```c
#include <iostream>
#include <deque>
#define maxsize 32
using namespace std;

struct Node
{
    Node *left, *right;
    int v;
};
deque<Node *> left_queue, right_queue;
int n, in[maxsize], post[maxsize];
Node *root = NULL;
Node *make(int inl, int inr, int postl, int postr)
{
    if (inl > inr)
        return NULL;
    Node *node = new Node();
    node->left = node->right = NULL;
    node->v = post[postr];
    int u;
    for (u = inl; u <= inr; u++)
        if (in[u] == post[postr])
            break;
    node->left = make(inl, u - 1, postl, postl + u - inl - 1);
    node->right = make(u + 1, inr, postl + u - inl, postr - 1);
    return node;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    for (int i = 1; i <= n; i++)
        cin >> in[i];
    for (int i = 1; i <= n; i++)
        cin >> post[i];
    root = make(1, n, 1, n);
    if (root->left != NULL)
        left_queue.push_back(root->left);
    if (root->right != NULL)
        left_queue.push_back(root->right);
    Node *top;
    cout << root->v;
    while (!left_queue.empty() || !right_queue.empty())
    {
        while (!left_queue.empty())
        {
            top = left_queue.front();
            cout << " " << top->v;
            left_queue.pop_front();
            if (top->left != NULL)
                right_queue.push_back(top->left);
            if (top->right != NULL)
                right_queue.push_back(top->right);
        }
        while (!right_queue.empty())
        {
            top = right_queue.back();
            cout << " " << top->v;
            right_queue.pop_back();
            if (top->right != NULL)
                left_queue.push_front(top->right);
            if (top->left != NULL)
                left_queue.push_front(top->left);
        }
    }

    return 0;
}

```
#### 1128

main.cpp

```c
#include <iostream>
#include <algorithm>
#include <vector>
#include <set>
#define maxsize 1002
using namespace std;
int n, m, tmp, matrx[maxsize][maxsize];
set<int> num;
void check()
{
    if (num.size() != m)
    {
        cout << "NO" << endl;
        return;
    }
    int a, b;
    for (int j = 1; j <= m; j++)
    {
        tmp = 0;
        a = j, b = 1;
        while (a >= 1 && b >= 1)
        {
            if (matrx[a][b] == 1)
            {
                tmp++;
            }
            a--;
            b++;
        }
        if (tmp > 1)
        {
            cout << "NO" << endl;
            return;
        }
    }
    for (int j = 2; j <= m; j++)
    {
        tmp = 0;
        b = j, a = m;
        while (a >= 1 && b <= m)
        {
            if (matrx[a][b] == 1)
            {
                tmp++;
            }
            a--;
            b++;
        }
        if (tmp > 1)
        {
            cout << "NO" << endl;
            return;
        }
    }
    cout << "YES" << endl;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    for (int i = 0; i < n; i++)
    {
        cin >> m;
        fill(matrx[1], matrx[1] + m * maxsize, 0);
        num.clear();
        for (int j = 1; j <= m; j++)
        {
            cin >> tmp;
            matrx[tmp][j] = 1;
            num.insert(tmp);
        }
        check();
    }

    return 0;
}
```
#### 1129

main.cpp

```c
#include <iostream>
#include <vector>
#include <algorithm>
#include <queue>
#include <unordered_map>
#define maxsize 50002
using namespace std;
int n, k, list[maxsize];
vector<int> tmp;
unordered_map<int, int> st;
bool cmp(int a, int b)
{
    if (st[a] != st[b])
        return st[a] > st[b];
    else
        return a < b;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> k;
    for (int i = 0; i < n; i++)
        cin >> list[i];
    st[list[0]] = 1;
    tmp.push_back(list[0]);
    for (int i = 1; i < n; i++)
    {

        cout << list[i] << ": ";
        sort(tmp.begin(), tmp.end(), cmp);
        for (int j = 0; j < k && j < tmp.size(); j++)
        {
            if (j != 0)
                cout << " ";
            cout << tmp[j];
        }
        if (st.find(list[i]) != st.end())
            st[list[i]]++;
        else
        {
            st[list[i]] = 1;
            tmp.push_back(list[i]);
        }
        cout << endl;
    }

    return 0;
}
```
priority_queue.cpp

```c
#include <iostream>
#include <vector>
#include <algorithm>
#include <set>
#define maxsize 50002
using namespace std;

struct node
{
    int v, num;
    bool operator<(const node &a) const
    {
        return (v != a.num) ? num > a.num : v < a.v;
    }
};
set<node> list;
int n, k, amount[maxsize] = {0};

int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> k;
    node item;
    int tmp = 0;

    cin >> item.v;
    amount[item.v]++;
    item.num = 1;
    list.insert(item);
    for (int i = 1; i < n; i++)
    {
        cin >> item.v;
        amount[item.v]++;
        cout << item.v << ": ";
        tmp = 0;
        for (set<node>::iterator it = list.begin(); it != list.end() && tmp < k; it++)
        {
            tmp++;
            if (it != list.begin())
                cout << " ";
            cout << (*it).v;
        }
        set<node>::iterator it = list.find(node{item.v, amount[item.v]});
        if (it != list.end())
            list.erase(it);
        amount[item.v]++;
        list.insert(node{item.v, amount[item.v]});
        cout << endl;
    }

    return 0;
}
```





#### 1130

main.cpp

```c
#include <iostream>
#include <algorithm>
using namespace std;
string out;
struct Node
{
    string v;
    int left, right;
};
Node tree[22];
int pre[22] = {0};
void inorder(int root)
{
    if (tree[root].left == -1 && tree[root].right == -1)
    {
        out += tree[root].v;
        return;
    }
    if (tree[root].left == -1 && tree[root].right != -1)
    {
        out += ("(" + tree[root].v);
        inorder(tree[root].right);
        out += ")";
        return;
    }
    if (tree[root].left != -1 && tree[root].right != -1)
    {
        out += ("(");
        inorder(tree[root].left);
        out += tree[root].v;
        inorder(tree[root].right);
        out += ")";
        return;
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    int n, l, r, root;
    string v;
    cin >> n;
    for (int i = 1; i <= n; i++)
    {
        cin >> v >> l >> r;
        pre[l] = i;
        pre[r] = i;
        tree[i].left = l;
        tree[i].right = r;
        tree[i].v = v;
    }
    for (int i = 1; i <= n; i++)
    {
        if (pre[i] == 0)
        {
            root = i;
            break;
        }
    }

    inorder(root);
    if (out[0] == '(' && out[out.size() - 1] == ')')
    {
        out = out.substr(1);
        out = out.substr(0, out.size() - 1);
    }
    cout << out << endl;
    return 0;
}
```
#### 1132

main.cpp

```c
#include <iostream>
#include <algorithm>
#include <ctype.h>
using namespace std;
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    int n;
    long long a, b, z;
    string ss;
    cin >> n;
    for (int i = 0; i < n; i++)
    {
        cin >> ss;
        a = stoll(ss.substr(0, ss.size() / 2));
        b = stoll(ss.substr(ss.size() / 2));
        z = stoll(ss);
        if (a == 0 || b == 0)
            cout << "No" << endl;
        else if (z % (a * b) == 0)
            cout << "Yes" << endl;
        else
            cout << "No" << endl;
    }

    return 0;
}
```
#### 1133

main.cpp

```c
#include <iostream>
#include <algorithm>
#include <map>
#include <vector>
#include <math.h>
#include <string>
#include <ctype.h>
using namespace std;
struct Node
{
    int v;
    string addr, next;
};
vector<Node> list;
map<string, Node> ram;
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    string first, addr, next;
    int n, k, v, i;

    cin >> first >> n >> k;
    for (i = 0; i < n; i++)
    {
        cin >> addr >> v >> next;
        ram[addr].v = v;
        ram[addr].addr = addr;
        ram[addr].next = next;
    }
    map<string, Node>::iterator it = ram.find(first), tmpit = ram.find(first);

    while (it != ram.end())
    {
        next = it->second.next;
        if (it->second.v < 0)
        {
            list.push_back(it->second);
            tmpit->second.next = it->second.next;
            ram.erase(it);
        }
        else
        {
            tmpit = it;
        }
        it = ram.find(next);
    }
    it = ram.find(first), tmpit = ram.find(first);
    while (it != ram.end())
    {
        next = it->second.next;

        if (it->second.v <= k && it->second.v >= 0)
        {
            list.push_back(it->second);
            tmpit->second.next = it->second.next;
            ram.erase(it);
        }
        else
        {
            tmpit = it;
        }
        it = ram.find(next);
    }
    /* it = ram.find(first), tmpit = ram.find(first);
    while (it != ram.end())
    {
        next = it->second.next;
        if (it->second.v == k)
        {
            list.push_back(it->second);
            tmpit->second.next = it->second.next;
            ram.erase(it);
            break;
        }
        else
        {
            tmpit = it;
        }
        it = ram.find(next);
    } */
    it = ram.find(first), tmpit = ram.find(first);
    while (it != ram.end())
    {
        next = it->second.next;

        if (it->second.v > k)
        {
            list.push_back(it->second);
            tmpit->second.next = it->second.next;
            ram.erase(it);
        }
        else
        {
            tmpit = it;
        }
        it = ram.find(next);
    }
    for (i = 0; i < list.size() - 1; i++)
        cout << list[i].addr << " " << list[i].v << " " << list[i + 1].addr << endl;
    cout << list[i].addr << " " << list[i].v << " -1" << endl;

    return 0;
}
```
#### 1134

main.cpp

```c
#include <iostream>
#include <set>
#define max_size 10001
using namespace std;

int n, m;
set<int> hasht[max_size];
int main()
{
    int a, b, t;
    set<int> s;
    cin >> n >> m;
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b;
        hasht[a].insert(i);
        hasht[b].insert(i);
    }
    cin >> t;
    for (int i = 0; i < t; i++)
    {
        cin >> a;
        s.clear();
        for (int j = 0; j < a; j++)
        {
            cin >> b;
            if (s.size() == m)
                continue;
            for (set<int>::iterator z = hasht[b].begin(); z != hasht[b].end(); z++)
                s.insert(*z);
        }
        // cout << s.size() << endl;
        cout << (s.size() == m ? "Yes" : "No") << endl;
    }
    return 0;
}
```
hash.cpp

```c
#include <iostream>
#include <set>
#define max_size 10001
using namespace std;

int n, m;
bool hashtVerge[max_size];
set<int> hashPoint[max_size];
int main()
{
    int a, b, t, z;
    cin >> n >> m;
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b;
        hashPoint[a].insert(i);
        hashPoint[b].insert(i);
    }
    cin >> t;
    for (int i = 0; i < t; i++)
    {
        cin >> a;
        fill(hashtVerge, hashtVerge + m, false);
        for (int j = 0; j < a; j++)
        {
            cin >> b;
            for (set<int>::iterator z = hashPoint[b].begin(); z != hashPoint[b].end(); z++)
                hashtVerge[*z] = true;
        }
        for (z = 0; z < m; z++)
            if (hashtVerge[z] == false)
                break;
        cout << (z == m ? "Yes" : "No") << endl;
    }

    return 0;
}
```



#### 1135

main.cpp

```c
#include <iostream>
#include <algorithm>
#include <vector>
#include <queue>
#define maxsize 32
using namespace std;
int n, m, tmp; // pre[maxsize], in[maxsize];
bool flag = true;
vector<int> pre, in;
struct Node
{
    int v;
    Node *left, *right;
};
Node *make(int inl, int inr, int prel, int prer)
{
    if (prel > prer)
    {
        return NULL;
    }
    Node *node = new Node;
    node->v = pre[prel];
    int u;
    for (u = inl; u <= inr; u++)
    {
        if (in[u] == pre[prel])
        {
            break;
        }
    }

    node->left = make(inl, u - 1, prel + 1, prel + u - inl);
    node->right = make(u + 1, inr, prel + u - inl + 1, prer);
    return node;
}
bool cmp(int a, int b)
{
    return abs(a) < abs(b);
}
int DP(Node *node)
{
    if (node == NULL)
        return 0;
    int left = DP(node->left), right = DP(node->right);
    if (left != right)
        flag = false;
    if (node->v > 0)
        return left + 1;
    else
        return left;
}
void check(Node *root)
{
    if (root->v < 0)
    {
        cout << "No" << endl;
        return;
    }
    //判断红节点子节点是不是都是黑的
    queue<Node *> q;
    q.push(root);
    while (!q.empty())
    {
        Node *tmp = q.front();
        q.pop();
        if (tmp->left != NULL)
        {
            q.push(tmp->left);
        }
        if (tmp->right != NULL)
        {
            q.push(tmp->right);
        }
        if (tmp->v < 0)
        {
            if ((tmp->left!=NULL &&tmp->left->v < 0) || (tmp->right!=NULL&&tmp->right->v < 0))
            {
                cout << "No" << endl;
                return;
            }
        }
        
    }
    //判断路径上的左右黑点数量是不是一致
    flag = true;
    DP(root);
    if (!flag)
    {
        cout << "No" << endl;
    }
    else
    {
        cout << "Yes" << endl;
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    Node *root;
    for (int i = 0; i < n; i++)
    {
        cin >> m;
		pre.clear();
        for (int j = 0; j < m; j++)
        {
            cin >> tmp;
            pre.push_back(tmp);
        }
        in = pre;
        sort(in.begin(), in.end(), cmp);
        root = make(0, m - 1, 0, m - 1);
        check(root);
    }

    return 0;
}
```
#### 1136

main.cpp

```c
#include <iostream>
#include <algorithm>
#include <map>
#include <vector>
#include <math.h>
#include <string>
#include <ctype.h>
using namespace std;
string reverse(string s)
{
    string ts;
    for (int i = s.size() - 1; i >= 0; --i)
        ts += s[i];
    return ts;
}
bool check(string s)
{
    int i = 0, j = s.size() - 1;
    while (i < s.size() && j >= 0 && j >= i)
    {
        if (s[i] != s[j])
            return false;
        ++i, --j;
    }
    return true;
}
string stringadd(string a, string b)
{
    int addw = 0, tmp;
    string ts;
    char ch;
    for (int i = a.size() - 1; i >= 0; --i)
    {
        tmp = (a[i] - '0') + (b[i] - '0') + addw;
        ts.insert(0, to_string(tmp % 10));
        addw = tmp / 10;
    }
    if (addw != 0)
        ts.insert(0, to_string(addw));
    return ts;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    int tmp, i;
    string a, b, c;

    cin >> a;
    for (i = 0; i < 10; i++)
    {
        b = reverse(a);
        c = stringadd(a, b);
        cout << a << " + " << b << " = " << c << endl;
        if (check(c))
            break;
        a = c;
    }
    if (i == 10)
        cout << "Not found in 10 iterations." << endl;
    else
        cout << c << " is a palindromic number." << endl;

    return 0;
}
```
#### 1137

main.cpp

```c
#include <iostream>
#include <algorithm>
#include <map>
#include <vector>
#include <math.h>
#include <string>
#define maxsize 50005
using namespace std;
int p, m, n;
struct Node
{
    string id;
    int p, m, n,g;
};
map<string, Node> stus;
vector<Node> out;
bool cmp(Node a, Node b)
{
    if (a.g != b.g)
        return a.g > b.g;
    else
        return a.id < b.id;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    int tmp;
    string ts;
    Node item;
    cin >> p >> m >> n;
    item.m = item.n = -1;
    for (int i = 0; i < p; i++)
    {
        cin >> ts >> item.p;
        if (item.p >= 200)
        {
            stus[ts] = item;
            stus[ts].id = ts;
        }
    }
    for (int i = 0; i < m; i++)
    {
        cin >> ts >> tmp;
        if (stus.find(ts) != stus.end())
            stus[ts].m = tmp;
    }
    for (int i = 0; i < n; i++)
    {
        cin >> ts >> tmp;
        if (stus.find(ts) != stus.end())
        {
            stus[ts].n = tmp;
            stus[ts].g = tmp;
            if (stus[ts].m > tmp)
                stus[ts].g = round(stus[ts].m * 0.4 + tmp * 0.6);
            if (stus[ts].g >= 60)
                out.push_back(stus[ts]);
        }
    }
    sort(out.begin(), out.end(), cmp);
    for (int i = 0; i < out.size(); i++)
    {
        cout << out[i].id << " " << out[i].p << " " << out[i].m
             << " " << out[i].n << " " << out[i].g << endl;
    }
    return 0;
}
```
#### 1138

main.cpp

```c
#include <iostream>
#include <algorithm>
#include <vector>
#define maxsize 50005
using namespace std;
int n, pre[maxsize], in[maxsize];
vector<int> out;
struct Node
{
    int val;
    Node *left, *right;
};
Node *make(int prel, int prer, int inl, int inr)
{
    if (prel > prer)
        return NULL;
    Node *node = new Node;
    node->val = pre[prel];

    int u;
    for (u = inl; u <= inr; u++)
        if (pre[prel] == in[u])
            break;
    node->left = make(prel + 1, prel + u - inl, inl, u - 1);
    node->right = make(prel + u - inl + 1, prer, u + 1, inr);
    return node;
}
void post(Node *root)
{
    if (root == NULL)
        return;
    post(root->left);
    post(root->right);
	out.push_back( root->val);
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);

    cin >> n;
    for (int i = 1; i <= n; i++)
        cin >> pre[i];
    for (int i = 1; i <= n; i++)
        cin >> in[i];
    Node *root = NULL;
    root = make(1, n, 1, n);
    post(root);
    cout << out[0] << endl;
    return 0;
}
```
#### 1139

main.cpp

```c
#include <iostream>
#include <algorithm>
#include <map>
#include <vector>
#define maxsize 302
using namespace std;
struct coupe
{
    string a, b;
};
vector<coupe> out;
int matrx[maxsize][maxsize],
    n, m;
map<string, int> encode;
map<int, string> decode;
bool cmp(coupe a, coupe b)
{
    return (a.a != b.a) ? a.a < b.a : a.b < b.b;
}
bool isSame(string a, string b)
{
    if (a[0] == '-' || b[0] == '-')
    {
        return a[0] == '-' && b[0] == '-';
    }
    else
    {
        return true;
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);

    cin >> n >> m;
    int a, b, index = 0;
    string sa, sb;
    for (int i = 0; i < m; i++)
    {
        cin >> sa >> sb;
        if (encode.find(sa) == encode.end())
        {
            encode[sa] = index;
            decode[index] = sa;
            index++;
        }
        if (encode.find(sb) == encode.end())
        {
            encode[sb] = index;
            decode[index] = sb;
            index++;
        }
        matrx[encode[sa]][encode[sb]] = 1;
        matrx[encode[sb]][encode[sa]] = 1;
    }
    cin >> m;
    for (int i = 0; i < m; i++)
    {
        cin >> sa >> sb;
        if (encode.find(sa) != encode.end() && encode.find(sb) != encode.end())
        {
            for (int j = 0; j < index; j++)
            {
                if (isSame(sa, decode[j]) && matrx[encode[sa]][j] == 1 && j != encode[sb])
                {
                    for (int z = 0; z < index; z++)
                    {
                        if (isSame(sb, decode[z]) && matrx[j][z] == 1 && matrx[z][encode[sb]] == 1 && z != encode[sa])
                        {
                            coupe c;
                            if (decode[j][0] == '-')
                                c.a = decode[j].substr(1);
                            else
                                c.a = decode[j];
                            if (decode[z][0] == '-')
                                c.b = decode[z].substr(1);
                            else
                                c.b = decode[z];
                            out.push_back(c);
                        }
                    }
                }
            }
        }
        sort(out.begin(), out.end(), cmp);
        cout << out.size() << endl;
        for (int i = 0; i < out.size(); i++)
            cout << out[i].a << " " << out[i].b << endl;
        out.clear();
    }

    return 0;
}
```
#### 1140

main.cpp

```c
#include <iostream>
#include <algorithm>
#include <string>
#define maxsize 202
using namespace std;
int m, n;
string s, tmp;
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> s >> m;
    for (int i = 0; i < m-1; i++)
    {
        tmp = s[0];
        n = 1;
        int j;
        for (j = 1; j < s.size(); j++)
        {
            if (s[j] == s[j - 1])
            {
                n++;
            }
            else
            {
                tmp += ('0' + n);
                tmp += s[j];
                n = 1;
            }
        }
        if (j == s.size())
            tmp += ('0' + n);
        s = tmp;
    }
    cout << s << endl;
    return 0;
}
/*1123123111*/
```
#### 1141

main.cpp

```c
#include <iostream>
#include <ctype.h>
#include <algorithm>
#include <string>
#include <map>
#include <vector>
using namespace std;
int n;
double point;
string id, school;
struct sch
{
    int num, score;
    double point;
    string name;
};
map<string, sch> list;
vector<sch> out;
void lower(string &s)
{
    for (int i = 0; i < s.size(); i++)
        s[i] = tolower(s[i]);
}
bool cmp(sch a, sch b)
{
    if (a.score != b.score)
        return a.score > b.score;
    else if (a.num != b.num)
        return a.num < b.num;
    else
        return a.name < b.name;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    for (int i = 0; i < n; i++)
    {
        cin >> id >> point >> school;
        lower(school);
        if (list.find(school) == list.end())
        {
            sch sc;
            sc.name = school;
            sc.num = 1;
            sc.point = point;
            switch (id[0])
            {
            case 'B':
                sc.point /= 1.5;
                break;
            case 'T':
                sc.point *= 1.5;
                break;
            }
            list.insert(make_pair(school, sc));
        }
        else
        {
            list[school].num++;
            switch (id[0])
            {
            case 'B':
                point /= 1.5;
                break;
            case 'T':
                point *= 1.5;
                break;
            }
            list[school].point += point;
        }
    }
    map<string, sch>::iterator it = list.begin();
    while (it != list.end())
    {
        it->second.score = it->second.point;
        out.push_back(it->second);
        it++;
    }
    sort(out.begin(), out.end(), cmp);
    int j = 1;
    cout << out.size() << endl
         << j << " " << out[0].name << " " << out[0].score << " " << out[0].num << endl;
    for (int i = 1; i < out.size(); i++)
    {
        if (out[i].score != out[i - 1].score)
            j = i + 1;
        cout << j << " ";
        cout << out[i].name << " " << out[i].score << " " << out[i].num << endl;
    }
    return 0;
}
```
#### 1142

main.cpp

```c
#include <iostream>
#include <algorithm>
#include <set>
#define maxsize 202
using namespace std;

int n, m, a, b, matrx[maxsize][maxsize] = {0}, list[maxsize];
set<int> lists;
bool vis[maxsize];

int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);

    cin >> n >> m;
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b;
        matrx[a][b] = matrx[b][a] = 1;
    }
    cin >> m;
    for (int i = 0; i < m; i++)
    {
        cin >> a;
		lists.clear();
        for (int j = 0; j < a; j++)
        {
            cin >> list[j];
            lists.insert(list[j]);
        }
        bool flag = true;
        for (int j = 0; j < a && flag; j++)
        {
            for (int z = 0; z < a && flag; z++)
            {
                if (matrx[list[j]][list[z]] != 1 && j != z)
                    flag = false;
            }
        }
        if (!flag)
        {
            cout << "Not a Clique" << endl;
        }
        else
        {
            int s;
            for (s = 1; s <= n; s++)
            {
                flag = true;
                if (lists.find(s) == lists.end())
                {
                    for (int z = 0; z < a && flag; z++)
                    {
                        if (matrx[s][list[z]] != 1)
                            flag = false;
                    }
                    if (flag)
                    {
                        cout << "Not Maximal" << endl;
                        break;
                    }
                }
            }
            if (s == n + 1)
            {
                cout << "Yes" << endl;
            }
        }
    }

    return 0;
}
```
#### 1143

main.cpp

```c
#include <iostream>
#include <queue>
#include <algorithm>
using namespace std;

struct Node
{
    int v;
    Node *left, *right;
};
int n, m, a, b, ta, tb;
Node *root = NULL;
deque<int> q, out;
Node *newNode(int val)
{
    Node *node = new Node;
    node->left = node->right = NULL;
    node->v = val;
    return node;
}
void insert(Node *&node, int val)
{
    if (node == NULL)
    {
        node = newNode(val);
        return;
    }
    if (val < node->v)
        insert(node->left, val);
    else
        insert(node->right, val);
}
void search(Node *node, int v)
{
    if (node == NULL)
        return;
    q.push_back(node->v);
    if (v < node->v)
        search(node->left, v);
    else if (v > node->v)
        search(node->right, v);
    else
        out = q;
    if (!q.empty())
        q.pop_back();
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);

    cin >> n >> m;
    for (int i = 0; i < m; i++)
    {
        cin >> a;
        insert(root, a);
    }
    for (int i = 0; i < n; i++)
    {
        cin >> ta >> tb;
        search(root, ta);
        deque<int> qa = out;
        out.clear();
        search(root, tb);
        deque<int> qb = out;
        if (qa.empty() && qb.empty())
            cout << "ERROR: " << ta << " and " << tb << " are not found." << endl;
        else if (qa.empty())
            cout << "ERROR: " << ta << " is not found." << endl;
        else if (qb.empty())
            cout << "ERROR: " << tb << " is not found." << endl;
        else
        {
            a = b = 0;
            while (!qa.empty() && !qb.empty() && a == b)
            {
                a = qa.front();
                qa.pop_front();
                b = qb.front();
                qb.pop_front();
                if (a == b)
                    m = a;
            }
            if (ta == m)
                cout << ta << " is an ancestor of " << tb << "." << endl;
            else if (tb == m)
                cout << tb << " is an ancestor of " << ta << "." << endl;
            else
                cout << "LCA of " << ta << " and " << tb << " is " << m << "." << endl;
        }
    }
    return 0;
}
```
#### 1144

main.cpp

```c
#include <iostream>
#include <set>
#include <algorithm>
using namespace std;
int n, a;
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cin >> n;
    set<int> table;
    for (int i = 0; i < n; i++)
    {
        cin >> a;
        if (a > 0)
            table.insert(a);
    }
    set<int>::iterator it = table.begin();
    for (a = 1; a <= table.size(); a++, it++)
        if (*it != a)
        {
            cout << a;
            return 0;
        }
    cout<<a;
    return 0;
}
```
#### 1145

main.cpp

```c
#include <iostream>
#include <vector>
#include <iomanip>
#include <math.h>
using namespace std;
int n, m, k, tsize, tmp, flag = 0, total = 0;
bool isPrime(int num)
{
    for (int i = 2; i <= sqrt(num * 1.0); i++)
        if (num % i == 0)
            return false;
    return true;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> m >> k;
	tsize = n;
    while (!isPrime(tsize))
        ++tsize;
    vector<int> table(tsize);
    for (int i = 0; i < m; i++)
    {
        cin >> tmp;
        flag = 0;
        for (int j = 0; j < tsize; j++)
        {
            int pos = (tmp + j * j) % tsize;
            if (table[pos] == 0)
            {
                table[pos] = tmp;
                flag = 1;
                break;
            }
        }
        if (!flag)
            cout << tmp << " cannot be inserted." << endl;
    }
    for (int i = 0; i < k; i++)
    {
        cin >> tmp;
        for (int j = 0; j <= tsize; j++)
        {
            total++;
            int pos = (tmp + j * j) % tsize;
            if (table[pos] == tmp || table[pos] == 0)
                break;
        }
    }
    printf("%.1f", total * 1.0 / k);
    return 0;
}
```
#### 1146

main.cpp

```c
#include <iostream>
#include <vector>
using namespace std;
int matrx[1001][1001] = {0}, indg[1001], nowindg[1001], n, m, a, b;
vector<int> out;
bool check()
{
    for (int i = 1; i <= n; i++)
        nowindg[i] = indg[i];
    vector<int> list;
    for (int i = 0; i < n; i++)
    {
        cin >> a;
        list.push_back(a);
    }
    for (int i = 0; i < n; i++)
    {
        a = list[i];
        if (nowindg[a] > 0)
            return false;
        else
        {
            for (int j = 1; j <= n; j++)
            {
                if (matrx[a][j] == 1)
                    nowindg[j]--;
            }
        }
    }
    return true;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> m;
    fill(indg, indg + n + 1, 0);
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b;
        matrx[a][b] = 1;
        indg[b]++;
    }
    cin >> b;
    for (int i = 0; i < b; i++)
        if (!check())
            out.push_back(i);
    cout << out[0];
    for (int i = 1; i < out.size(); i++)
        cout << " " << out[i];
    return 0;
}
```
#### 1148

main.cpp

```c
#include <iostream>
#include <vector>
using namespace std;
int n, m, tmp, list[101];
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    for (int i = 1; i <= n; i++)
        cin >> list[i];
    for (int i = 1; i <= n; i++)
    {
        for (int j = i + 1; j <= n; j++)
        {
            int wolflie = 0, lie = 0;
            for (int z = 1; z <= n; z++)
            {
                if (z == i || z == j) //狼人
                {
                    if (list[z] > 0) //判定为好人
                    {
                        if (list[z] == i || list[z] == j) //认定的好人是狼人
                        {
                            lie++;
                            wolflie++;
                        }
                    }
                    else //判定为狼人
                    {
                        if (abs(list[z]) != i && abs(list[z]) != j) //认定的狼人是好人
                        {
                            lie++;
                            wolflie++;
                        }
                    }
                }
                else //人类
                {
                    if (list[z] > 0) //判定为好人
                    {
                        if (list[z] == i || list[z] == j) //认定的狼人是好人
                            lie++;
                    }
                    else //判定为狼人
                    {
                        if (abs(list[z]) != i && abs(list[z]) != j) //认定的好人是狼人
                            lie++;
                    }
                }
            }
            if (lie == 2 && wolflie == 1)
            {
                cout << i << " " << j << endl;
                return 0;
            }
        }
    }
    cout << "No Solution" << endl;
    return 0;
}
```
#### 1149

main.cpp

```c
#include <iostream>
#include <map>
#include <string>
#include <vector>
using namespace std;
int n, m, tmp;
map<string, vector<string>> matrx;
vector<string> list;
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    string a, b;
    cin >> n >> m;
    for (int i = 0; i < n; i++)
    {
        cin >> a >> b;
        matrx[a].push_back(b);
        matrx[b].push_back(a);
    }
    for (int i = 0; i < m; i++)
    {
        cin >> tmp;
        list.clear();
        for (int j = 0; j < tmp; j++)
        {
            cin >> a;
            list.push_back(a);
        }
        bool flag = true;
        for (int j = 0; j < tmp && flag; j++)
        {
            vector<string> li = matrx[list[j]];
            for (int z = 0; z < li.size() && flag; z++)
            {
                for (int k = j + 1; k < tmp && flag; k++)
                {
                    if (list[k] == li[z])
                        flag = false;
                }
            }
        }
        cout << (flag ? "Yes" : "No") << endl;
    }

    return 0;
}
```
#### 1150

main.cpp

```c
#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <set>
#define maxsize 201
using namespace std;
int n, m, k, g[maxsize][maxsize], mini = 996996996, mini_index;
vector<int> path;
map<int, int> test;
void check(int index)
{
    int len = 0, circle = 0, circleFlag = 0;
    for (int i = 0; i < path.size() - 1; i++)
    {
        if (g[path[i]][path[i + 1]] > 0)
            len += g[path[i]][path[i + 1]];
        else
        {
            cout << "Path " << index << ": NA (Not a TS cycle)" << endl;
            return;
        }
    }
    for (map<int, int>::iterator it = test.begin(); it != test.end(); it++)
    {
        if (it->second > 1)
            circle++;
    }
    circleFlag = (path[0] == path[path.size() - 1] && test.size() == n ? circle == 1 ? 0 : 1 : -1);
    if (circleFlag == 1 || circleFlag == 0 && len < mini)
    {
        mini = len;
        mini_index = index;
    }
    cout << "Path " << index << ": " << len << " (" << (circleFlag == -1 ? "Not a TS cycle" : circleFlag == 0 ? "TS simple cycle" : "TS cycle") << ")" << endl;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> m;
    int a, b, c;
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b >> c;
        g[a][b] = g[b][a] = c;
    }
    cin >> k;
    for (int i = 0; i < k; i++)
    {
        cin >> a;
        path.clear();
        test.clear();
        for (int j = 0; j < a; j++)
        {
            cin >> b;
            path.push_back(b);
            test[b]++;
        }
        check(i + 1);
    }
    cout << "Shortest Dist(" << mini_index << ") = " << mini << endl;

    return 0;
}
```
#### 1151

main.cpp

```c
#include <iostream>
#include <algorithm>
#include <string>
#define maxsize 10001
using namespace std;
int n, m, in[maxsize], pre[maxsize], a, b, tree;
void check(int a, int b)
{
}
void create()
{
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> m >> n;
    for (int i = 1; i <= n; i++)
        cin >> in[i];
    for (int i = 1; i <= n; i++)
        cin >> pre[i];
    create();
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b;
        check(a, b);
    }
    
    return 0;
}
```
old.cpp

```c
#include <iostream>
#include <queue>
#define maxsize 10001
using namespace std;
int m, n, tmp, a, b, pre[maxsize], in[maxsize];
deque<int> qa, qb, qtmp, qt;
bool flag = false;
struct node
{
    int v;
    node *left, *right;
};
node *create(int inl, int inr, int prel, int prer)
{
    if (inl > inr)
        return NULL;
    node *root = new node;
    root->v = pre[prel];
    int z = -1;
    for (z = inl; z <= inr; z++)
        if (in[z] == pre[prel])
            break;

    root->left = create(inl, z - 1, prel + 1, prel + z - inl);
    root->right = create(z + 1, inr, prel + z - inl + 1, prer);
    return root;
}
void dfs(node *root, int val)
{
    if (root == NULL)
        return;
    qtmp.push_back(root->v);
    if (root->v == val)
    {
        qt = qtmp;
        flag = true;
    }
    dfs(root->left, val);
    dfs(root->right, val);
    qtmp.pop_back();
}
bool find(node *root, int a, int b)
{
    bool flaga = false, flagb = false;
    dfs(root, b);
    flagb = flag;
    flag = false;
    qb = qt;
    dfs(root, a);
    flaga = flag;
    flag = false;
    qa = qt;
    if (!flaga && !flagb)
    {
        cout << "ERROR: " << a << " and " << b << " are not found." << endl;
        return false;
    }
    else if (!flaga || !flagb)
    {
        cout << "ERROR: " << (!flaga ? a : b) << " is not found." << endl;
        return false;
    }
    while (!qa.empty() && !qb.empty())
    {
        a = qa.front();
        b = qb.front();
        qa.pop_front();
        qb.pop_front();
        if (a == b)
            tmp = a;
        else
            break;
    }
    return true;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> m >> n;
    node *root = NULL;
    for (int i = 0; i < n; i++)
        cin >> in[i];
    for (int i = 0; i < n; i++)
        cin >> pre[i];
    root = create(0, n - 1, 0, n - 1);
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b;
        if (find(root, a, b))
            if (tmp == a || tmp == b)
                cout << tmp << " is an ancestor of " << (tmp == a ? b : a) << "." << endl;
            else
                cout << "LCA of " << a << " and " << b << " is " << tmp << "." << endl;
    }

    return 0;
}
```





#### 1152

main.cpp

```c
#include <iostream>
#include <algorithm>
#include <string>
#include <math.h>
using namespace std;
int n, m;
bool check(string s)
{
    int num = stoi(s);
    for (int i = 2; i < sqrt(num*1.0); i++)
    {
        if (num % i == 0)
            return false;
    }
    cout << s << endl;
    return true;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> m;
    string s, t;
    cin >> s;
    bool flag = false;
    for (int i = 0; i < s.size(); i++)
    {
        t = s.substr(i, m);
        if (t.size() == m)
        {
            if (check(t))
            {
                flag = true;
                break;
            }
        }
        else
            break;
    }
    if (!flag)
        cout << "404" << endl;
    return 0;
}
```
#### 1153

main.cpp

```c
#include <iostream>
#include <algorithm>
#include <string>
#include <vector>
#include <map>
using namespace std;
struct cn
{
    char level;
    int room, time, score;
    string id;
};
struct out_tmp
{
    int room, num;
};
int n, m;
vector<cn> list, now;
void make(string s, int score)
{
    cn cnt;
    cnt.level = s[0];
    cnt.room = stoi(s.substr(1, 3));
    cnt.time = stoi(s.substr(4, 6));
    cnt.id = s.substr(10);
    cnt.score = score;
    list.push_back(cnt);
}
bool cmp1(cn a, cn b)
{
    if (a.score != b.score)
        return a.score > b.score;
    else
        return (a.room != b.room) ? a.room < b.room : (a.time != b.time ? a.time < b.time : a.id < b.id);
}
bool cmp3(out_tmp a, out_tmp b)
{
    if (a.num != b.num)
        return a.num > b.num;
    else
        return a.room < b.room;
}
void check(int index, string s, int isnow)
{
    now.clear();
    switch (index)
    {
    case 1:
    {
        cout << "Case " << isnow << ": " << index << " " << s << endl;
        for (int i = 0; i < list.size(); i++)
        {
            if (list[i].level == s[0])
                now.push_back(list[i]);
        }
        sort(now.begin(), now.end(), cmp1);
        if (now.size() == 0)
        {
            cout << "NA" << endl;
            break;
        }
        for (int i = 0; i < now.size(); i++)
            cout << now[i].level << now[i].room << now[i].time << now[i].id << " " << now[i].score << endl;

        break;
    }
    case 2:
    {
        cout << "Case " << isnow << ": " << index << " " << s << endl;
        int room = stoi(s), num = 0, total = 0;
        for (int i = 0; i < list.size(); i++)
        {
            if (list[i].room == room)
            {
                num++;

                total += list[i].score;
            }
        }
        if (num == 0)
        {
            cout << "NA" << endl;
            break;
        }
        cout << num << " " << total << endl;
        break;
    }
    case 3:
    {
        cout << "Case " << isnow << ": " << index << " " << s << endl;
        int time = stoi(s);
        map<int, int> out;
        vector<out_tmp> li;

        for (int i = 0; i < list.size(); i++)
            if (list[i].time == time)
            {
                if (out.find(list[i].room) != out.end())
                    out[list[i].room]++;
                else
                    out[list[i].room] = 1;
            }
        for (map<int, int>::iterator it = out.begin(); it != out.end(); it++)
        {
            out_tmp ot;
            ot.room = it->first;
            ot.num = it->second;
            li.push_back(ot);
        }
        sort(li.begin(), li.end(), cmp3);
        if (li.size() == 0)
        {
            cout << "NA" << endl;
            break;
        }
        for (int i = 0; i < li.size(); i++)
            cout << li[i].room << " " << li[i].num << endl;
        break;
    }
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> m;
    string s;
    int tmp;
    for (int i = 0; i < n; i++)
    {
        cin >> s >> tmp;
        make(s, tmp);
    }
    for (int i = 0; i < m; i++)
    {
        cin >> tmp >> s;
        check(tmp, s, i + 1);
    }

    return 0;
}
/*
8 4
B123180908127 99
B102180908003 86
A112180318002 98
T107150310127 62
A107180908108 100
T123180908010 78
B112160918035 88
A107180908021 98
8 10
B123111111127 99
B123111111128 99
B123111111126 100
T107111111127 62
A107111111108 100
T123180908010 78
B112160918035 88
A107180908021 98
 */
```
#### 1154

main.cpp

```c
#include <iostream>
#include <vector>
#include <set>
#define maxsize 10001
using namespace std;
int n, m, colors[maxsize];
set<int> color_num;
vector<int> matrx[maxsize];
void check()
{
    for (int i = 0; i < n; i++)
    {
        for (int j = 0; j < matrx[i].size(); j++)
        {
            if (colors[i] == colors[matrx[i][j]])
            {
                cout << "No" << endl;
                return;
            }
        }
    }
    cout << color_num.size() << "-coloring" << endl;
}
int main()
{
    int a, b;
    cin >> n >> m;
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b;
        matrx[a].push_back(b);
        matrx[b].push_back(a);
    }
    cin >> a;
    for (int i = 0; i < a; i++)
    {
        color_num.clear();
        for (int j = 0; j < n; j++)
        {
            cin >> colors[j];
            color_num.insert(colors[j]);
        }
        check();
    }

    return 0;
}
```
#### 1155

main.cpp

```c
#include <iostream>
#include <vector>
#define maxsize 1001
using namespace std;
int n, heap[maxsize];
vector<int> path;
bool res = true;
void print()
{
    cout << path[0];
    for (int i = 1; i < path.size(); i++)
        cout << " " << path[i];
    cout << endl;
}
void dfs(int index, bool isMax)
{
    path.push_back(heap[index]);
    if ((index * 2 + 1) > n && (index * 2) > n)
        print();
    if ((index * 2 + 1) <= n)
    {
        res = res == false ? false : isMax ? (heap[index] > heap[index * 2 + 1]) : (heap[index] < heap[index * 2 + 1]);
        dfs(index * 2 + 1, isMax);
    }
    if ((index * 2) <= n)
    {
        res = res == false ? false : isMax ? (heap[index] > heap[index * 2]) : (heap[index] < heap[index * 2]);
        dfs(index * 2, isMax);
    }
    path.pop_back();
}
int main()
{
    cin >> n;
    for (int i = 1; i <= n; i++)
        cin >> heap[i];
    if (heap[1] > heap[2])
        dfs(1, true);
    else
        dfs(1, false);
    cout << (res ? (heap[1] > heap[2] ? "Max Heap" : "Min Heap") : "Not Heap");
    return 0;
}
```

