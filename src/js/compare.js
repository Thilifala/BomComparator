(function ($) {
    let treedata = {
        treeA: [],
        treeB: []
    }

    //比较结果
    const compareRst = {
        same: 1,
        update: 2,
        add: 3,
        del: 4
    };

    let isArray = function (o) {
        return Object.prototype.toString.call(o) == '[object Array]';
    };

    let shiftNode = function (queen) {
        if (!isArray(queen)) {
            console.error('invoke error:parameter is not right!');
            return;
        }
        while (queen.length > 0) {
            let node = queen.shift();
            if (node.compareRst !== compareRst.add && node.compareRst !== compareRst.del) {
                return node;
            }
        }
    };

    let findNode = function (nodearr, id) {
        for (let i = 0; i < nodearr.length; i++) {
            if (nodearr[i].id === id) return nodearr[i];
        }
        return null;
    };

    let changeRowStyle = function (rowdata) {
        if (rowdata.compareRst === compareRst.add) {
            return 'background-color:lightgreen;color:blue;font-weight:bold;';
        }
        if (rowdata.compareRst === compareRst.del) {
            return 'background-color:lightcoral;color:blue;font-weight:bold;';
        }
        if (rowdata.compareRst === compareRst.update) {
            return 'background-color:pink;color:blue;font-weight:bold;';
        }
        if (rowdata.compareRst === compareRst.same) {
            return;
        }
    };
    //A,B两树数据load完后加载界面，可用promise改良
    let loadTreeData = function () {
        $.ajax({
            'url': 'mock/treegrid_dataA.json',
            'method': 'get',
            'success': function (data) {
                treedata.treeA = JSON.parse(data);
                $.ajax({
                    'url': 'mock/treegrid_dataB.json',
                    'method': 'get',
                    'success': function (data) {
                        treedata.treeB = JSON.parse(data);
                        if (treedata.treeA.length > 0 && treedata.treeB.length > 0) {
                            compareNodes(treedata.treeA[0], treedata.treeB[0]);
                        }
                        initTree();
                    }
                })
            }
        });

    };

    let initTree = function () {
        $('#treegrid1').treegrid({
            // url: 'mock/treegrid_dataA.json',
            data: treedata.treeA,
            method: 'get',
            rownumbers: true,
            idField: 'id',
            treeField: 'name',
            rowStyler: function (rowdata) {
                return changeRowStyle(rowdata);
            }
        });
        $('#treegrid2').treegrid({
            // url: 'mock/treegrid_dataB.json',
            data: treedata.treeB,
            method: 'get',
            rownumbers: true,
            idField: 'id',
            treeField: 'name',
            rowStyler: function (rowdata) {
                 return changeRowStyle(rowdata);
            }
        });
    };
    //比较节点
    let compareNodes = function (nJsonA, nJsonB) {
        let queenA = [], queenB = [];
        queenA.unshift(nJsonA);
        queenB.unshift(nJsonB);
        while (queenA.length > 0) {
            let sftNodeA = shiftNode(queenA);
            let sftNodeB = shiftNode(queenB);
            if ((sftNodeA.children && sftNodeA.children.length > 0) || (sftNodeB.children && sftNodeB.children.length > 0)) {
                compareSameLvNodes(sftNodeA.children, sftNodeB.children);
                queenA = queenA.concat(sftNodeA.children);
                queenB = queenB.concat(sftNodeB.children);
            }
            console.log(sftNodeA.name);
        }
    }

    //比较同层节点
    let compareSameLvNodes = function (nodearrA, nodearrB) {
        $.each(nodearrA, function (i, nodeA) {
            let nodeB = findNode(nodearrB, nodeA.id);
            if (nodeB) {
                //比较节点属性，如名称
                if (nodeA.name === nodeB.name) {
                    nodeA.compareRst = nodeB.compareRst = compareRst.same;
                }
                else {
                    nodeA.compareRst = nodeB.compareRst = compareRst.update;
                }
            }
            else {
                nodeA.compareRst = compareRst.del;
            }
        })
        $.each(nodearrB, function (j, nodeB) {
            nodeB.compareRst = nodeB.compareRst || compareRst.add;
        })
    }

    $(function () {
        loadTreeData();
    })
})(jQuery)
