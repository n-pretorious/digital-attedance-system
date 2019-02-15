let unitsList= {
    units: [],
    addUnit: function (unitCode) {
		this.units.push({
        unitCode: unitCode,
        });        
	},
}

let studentList = {
    students: [],
    addStudent: function (studentId) {
        this.students.push({
            studentId: studentId
        });
    }
}

let classSession = {
    units: function () {
        unitsList.units.forEach(unit => {
            console.log(unit.unitCode);
        });
    },
    students: function () {
        studentList.students.forEach(student => {
            console.log(student.studentId);
        });
    },
    startDate: new Date(),
    endDate: null,
}

let handlers = {
    assingUnitToClass: function () {
        let viewUnits = document.getElementById('viewUnits')
        let selectedUnit = viewUnits.options[viewUnits.selectedIndex].text
        unitsList.addUnit(selectedUnit)
    },
    startClass: function () {
        classSession.startDate
        classSession.units()

        console.log(classSession.startDate);
    },
    endClass: function () {
        classSession.endDate = new Date()

        console.log(classSession.endDate); 
    },
    studentJoinClass: function () {
// get element from table row and submit
    }
}