let units = {
    unit: []
}

let student = []

let view = {
    displayUnits: function () {
        units.forEach(unit => {
            // unit
            console.log(unit);            
        });
    }
}

let classSession = {
    unitId: units[1],
    startDate: new Date(),
    endDate: null,
    studentIds: [0],
}

let handlers = {
    startClass: function () {
        classSession.startDate
        console.log(classSession.startDate);     
    },
    endClass: function () {
        classSession.endDate = new Date()
        console.log(classSession.endDate);
        
    }
}