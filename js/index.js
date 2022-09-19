require([
    'dstore/Memory',
    'dgrid/OnDemandGrid'
], function(Memory, OnDemandGrid) {
    let grid;
    function getTestData() {
        return [
            { first: 'Bob', last: 'Barker', age: 89 },
            { first: 'Vanna', last: 'White', age: 55 },
            { first: 'Pat', last: 'Sajak', age: 65 },
            { first: 'Thomas', last: 'Bush', age: 12 },
            { first: 'Robert', last: 'Gray', age: 25 },
            { first: 'Bill', last: 'Smith', age: 44 },
        ];
    }
    function getData(delay) {
        const promiseCallback = function(resolve, reject) {
            setTimeout(function() {
                const data = getTestData();
                resolve(data);
            }, delay);
        };
        const promise = new Promise(promiseCallback);
        return promise;
    }
    function updateGrid() {
        grid.gridIsUpdating = true;
        grid.refresh();
        getData(4000).then(function(data) {
            grid.gridIsUpdating = false;
            grid.collection.setData(data);
            grid.refresh();
        });
    }
    function formatter(value) {
        if (this.grid.gridIsUpdating) {
            return { 'html': '<div class="skeleton"></div>' };
        } else {
            return value;
        }
    };
    const columns = [
        {
            'field': 'first',
            'label': 'First Name',
            'formatter': formatter
        },
        {
            'field': 'last',
            'label': 'Last Name',
            'formatter': formatter
        },
        {
            'field': 'age',
            'label': 'Age',
            'formatter': formatter
        },
    ];
    // Create an instance of OnDemandGrid referencing the store
    getData(0).then(function(data) {
        grid = new OnDemandGrid({
            collection: new Memory({ data: data }),
            className: 'dgrid-autoheight',
            columns: columns,
            gridIsUpdating: false,
        }, 'grid');
        grid.startup();
    });

    const updateButton = document.getElementById("update");
    updateButton.onclick = updateGrid;
});