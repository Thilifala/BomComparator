(function ($) {
    let initTree = function () {
        $('#treegrid1').treegrid({
            url: 'mock/treegrid_data0.json',
            method: 'get',
            rownumbers: true,
            idField: 'id',
            treeField: 'name',
            rowStyler: function (rowdata) {
                if (rowdata.id===222) {
                    return 'background-color:pink;color:blue;font-weight:bold;';
                }
            }
        });
    }
    $(function () {
        initTree();
    })
})(jQuery)
