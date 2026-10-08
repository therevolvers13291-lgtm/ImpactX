function openProblem(problemName) {
    localStorage.setItem("selectedProblem", problemName);
    window.location.href = "explorer.html";
}


const problemData = {

    "Electricity wasted in empty classrooms": {
        description:
            "Lights, fans and other electrical devices can remain switched on even when classrooms are empty.",

        people:
            "Students, teachers, school staff and the school administration.",

        impact:
            "Unnecessary electricity use increases energy consumption and can create avoidable costs."
    },

    "Traffic congestion near school gates": {
        description:
            "Large numbers of vehicles arriving and leaving at similar times can create congestion near school gates.",

        people:
            "Students, parents, drivers, pedestrians and school staff.",

        impact:
            "Congestion can waste time and make the area less convenient and organized."
    },

    "Difficulty finding quiet study spaces": {
        description:
            "Students may sometimes struggle to find suitable quiet areas for focused study.",

        people:
            "Students and teachers.",

        impact:
            "A lack of suitable study spaces can make focused learning more difficult."
    },

    "Difficult access to some school spaces": {
        description:
            "Some school areas may not be equally convenient or accessible for everyone.",

        people:
            "Students, teachers, visitors and people with different accessibility needs.",

        impact:
            "Better accessibility can help create a more inclusive school environment."
    },

    "Long queues during lunch breaks": {
        description:
            "Many students may try to purchase or collect food at the same time.",

        people:
            "Students, canteen staff and teachers.",

        impact:
            "Long queues can reduce available break time and create unnecessary crowding."
    },

    "Difficulty maintaining focused screen use": {
        description:
            "Students may find it difficult to maintain focused and balanced use of digital devices.",

        people:
            "Students, parents and teachers.",

        impact:
            "Better digital habits can support concentration and responsible technology use."
    }

};


/* =========================================
   PROBLEM EXPLORER
   ========================================= */

function loadProblem() {

    const problemTitle =
        document.getElementById("problemTitle");

    if (!problemTitle) return;

    const selectedProblem =
        localStorage.getItem("selectedProblem");

    if (!selectedProblem || !problemData[selectedProblem]) {

        problemTitle.textContent =
            "No problem selected";

        return;
    }

    const data =
        problemData[selectedProblem];

    problemTitle.textContent =
        selectedProblem;

    const description =
        document.getElementById("problemDescription");

    const people =
        document.getElementById("problemPeople");

    const impact =
        document.getElementById("problemImpact");

    if (description)
        description.textContent = data.description;

    if (people)
        people.textContent = data.people;

    if (impact)
        impact.textContent = data.impact;
}


/* =========================================
   SOLUTION LAB
   ========================================= */

function loadSolutionLab() {

    const selectedProblem =
        localStorage.getItem("selectedProblem");

    const selectedProblemElement =
        document.getElementById("selectedProblem");

    if (!selectedProblemElement) return;

    selectedProblemElement.textContent =
        selectedProblem || "No problem selected";
}


function selectSolution(solutionName) {

    localStorage.setItem(
        "selectedSolution",
        solutionName
    );

    window.location.href =
        "simulator.html";
}


/* =========================================
   SIMULATOR
   ========================================= */

function loadSimulator() {

    const simProblem =
        document.getElementById("simProblem");

    if (!simProblem) return;

    const selectedProblem =
        localStorage.getItem("selectedProblem");

    simProblem.textContent =
        selectedProblem || "No problem selected";


    const impactSlider =
        document.getElementById("impactSlider");

    const feasibilitySlider =
        document.getElementById("feasibilitySlider");

    const sustainabilitySlider =
        document.getElementById("sustainabilitySlider");

    const impactValue =
        document.getElementById("impactValue");

    const feasibilityValue =
        document.getElementById("feasibilityValue");

    const sustainabilityValue =
        document.getElementById("sustainabilityValue");


    if (
        !impactSlider ||
        !feasibilitySlider ||
        !sustainabilitySlider
    ) {
        return;
    }


    function updateSimulation() {

        const impact =
            Number(impactSlider.value);

        const feasibility =
            Number(feasibilitySlider.value);

        const sustainability =
            Number(sustainabilitySlider.value);


        if (impactValue)
            impactValue.textContent = impact;

        if (feasibilityValue)
            feasibilityValue.textContent = feasibility;

        if (sustainabilityValue)
            sustainabilityValue.textContent =
                sustainability;


        const score1 =
            Math.round(
                impact * 0.35 +
                feasibility * 0.40 +
                sustainability * 0.25
            );


        const score2 =
            Math.round(
                impact * 0.30 +
                feasibility * 0.45 +
                sustainability * 0.25
            );


        const score3 =
            Math.round(
                impact * 0.45 +
                feasibility * 0.20 +
                sustainability * 0.35
            );


        const scoreElement1 =
            document.getElementById("score1");

        const scoreElement2 =
            document.getElementById("score2");

        const scoreElement3 =
            document.getElementById("score3");


        if (scoreElement1)
            scoreElement1.textContent = score1;

        if (scoreElement2)
            scoreElement2.textContent = score2;

        if (scoreElement3)
            scoreElement3.textContent = score3;


        const scores =
            [score1, score2, score3];


        const names =
            [
                "Smart Monitoring",
                "Student Action Teams",
                "Process Redesign"
            ];


        const highestScore =
            Math.max(...scores);


        const bestIndex =
            scores.indexOf(highestScore);


        const card1 =
            document.getElementById("solutionCard1");

        const card2 =
            document.getElementById("solutionCard2");

        const card3 =
            document.getElementById("solutionCard3");


        if (card1)
            card1.style.borderColor =
                bestIndex === 0
                    ? "var(--primary)"
                    : "var(--border)";


        if (card2)
            card2.style.borderColor =
                bestIndex === 1
                    ? "var(--primary)"
                    : "var(--border)";


        if (card3)
            card3.style.borderColor =
                bestIndex === 2
                    ? "var(--primary)"
                    : "var(--border)";


        const bestSolution =
            document.getElementById("bestSolution");


        if (bestSolution) {

            bestSolution.textContent =
                names[bestIndex] +
                " — " +
                highestScore +
                "/100";
        }


        localStorage.setItem(
            "bestSolution",
            names[bestIndex]
        );

        localStorage.setItem(
            "bestScore",
            highestScore
        );
    }


    impactSlider.addEventListener(
        "input",
        updateSimulation
    );

    feasibilitySlider.addEventListener(
        "input",
        updateSimulation
    );

    sustainabilitySlider.addEventListener(
        "input",
        updateSimulation
    );


    updateSimulation();
}


/* =========================================
   ACTION LAB
   ========================================= */

function loadActionLab() {

    const actionProblem =
        document.getElementById("actionProblem");

    if (!actionProblem) return;


    const selectedProblem =
        localStorage.getItem("selectedProblem");


    actionProblem.textContent =
        selectedProblem || "No problem selected";


    const savedGoal =
        localStorage.getItem("actionGoal");

    const savedSteps =
        localStorage.getItem("actionSteps");

    const savedPeople =
        localStorage.getItem("actionPeople");

    const savedTimeline =
        localStorage.getItem("actionTimeline");


    if (
        savedGoal &&
        document.getElementById("goalInput")
    ) {
        document.getElementById("goalInput").value =
            savedGoal;
    }


    if (
        savedSteps &&
        document.getElementById("stepsInput")
    ) {
        document.getElementById("stepsInput").value =
            savedSteps;
    }


    if (
        savedPeople &&
        document.getElementById("peopleInput")
    ) {
        document.getElementById("peopleInput").value =
            savedPeople;
    }


    if (
        savedTimeline &&
        document.getElementById("timelineInput")
    ) {
        document.getElementById("timelineInput").value =
            savedTimeline;
    }
}


function startProject() {

    const goalElement =
        document.getElementById("goalInput");

    const stepsElement =
        document.getElementById("stepsInput");

    const peopleElement =
        document.getElementById("peopleInput");

    const timelineElement =
        document.getElementById("timelineInput");


    if (
        !goalElement ||
        !stepsElement ||
        !peopleElement ||
        !timelineElement
    ) {
        return;
    }


    const goal =
        goalElement.value.trim();

    const steps =
        stepsElement.value.trim();

    const people =
        peopleElement.value.trim();

    const timeline =
        timelineElement.value;


    if (
        !goal ||
        !steps ||
        !people ||
        !timeline
    ) {

        const message =
            document.getElementById("projectMessage");

        if (message) {

            message.textContent =
                "Please complete all four parts of your action plan.";

        }

        return;
    }


    localStorage.setItem(
        "actionGoal",
        goal
    );

    localStorage.setItem(
        "actionSteps",
        steps
    );

    localStorage.setItem(
        "actionPeople",
        people
    );

    localStorage.setItem(
        "actionTimeline",
        timeline
    );

    localStorage.setItem(
        "projectCreated",
        "true"
    );


    const message =
        document.getElementById("projectMessage");


    if (message) {

        message.textContent =
            "✓ Your ImpactX project plan has been created!";
    }


    console.log(
        "ImpactX Project Started"
    );
}


/* =========================================
   IMPACT DASHBOARD
   ========================================= */

function loadImpactDashboard() {

    const impactProblem =
        document.getElementById("impactProblem");

    if (!impactProblem) return;


    const selectedProblem =
        localStorage.getItem("selectedProblem");

    const selectedSolution =
        localStorage.getItem("bestSolution") ||
        localStorage.getItem("selectedSolution");

    const timeline =
        localStorage.getItem("actionTimeline");

    const people =
        localStorage.getItem("actionPeople");

    const bestScore =
        Number(
            localStorage.getItem("bestScore") || 0
        );


    /* PROBLEM */

    impactProblem.textContent =
        selectedProblem ||
        "No problem selected";


    const dashboardProblem =
        document.getElementById(
            "dashboardProblem"
        );

    if (dashboardProblem) {

        dashboardProblem.textContent =
            selectedProblem ||
            "Not selected";
    }


    /* SOLUTION */

    const dashboardSolution =
        document.getElementById(
            "dashboardSolution"
        );

    if (dashboardSolution) {

        dashboardSolution.textContent =
            selectedSolution ||
            "Not selected";
    }


    /* TIMELINE */

    const dashboardTimeline =
        document.getElementById(
            "dashboardTimeline"
        );

    if (dashboardTimeline) {

        dashboardTimeline.textContent =
            timeline ||
            "Not created";
    }


    /* TEAM */

    const dashboardPeople =
        document.getElementById(
            "dashboardPeople"
        );

    if (dashboardPeople) {

        dashboardPeople.textContent =
            people ||
            "Not assigned";
    }


    /* IMPACT SCORE */

    const impactScore =
        document.getElementById(
            "impactScore"
        );


    if (impactScore) {

        impactScore.textContent =
            bestScore +
            "%";
    }


    /* STATUS MESSAGE */

    const impactMessage =
        document.getElementById(
            "impactMessage"
        );


    if (impactMessage) {

        if (
            selectedProblem &&
            selectedSolution &&
            timeline &&
            people
        ) {

            impactMessage.textContent =
                "✓ Your project has a complete planning snapshot.";

        } else {

            impactMessage.textContent =
                "Complete the earlier stages to build your project snapshot.";

        }
    }
}


/* =========================================
   RECALCULATE IMPACT
   ========================================= */

function updateImpact() {

    const bestScore =
        Number(
            localStorage.getItem("bestScore") || 0
        );


    const impactScore =
        document.getElementById(
            "impactScore"
        );


    if (impactScore) {

        impactScore.textContent =
            bestScore +
            "%";
    }


    const message =
        document.getElementById(
            "impactMessage"
        );


    if (message) {

        message.textContent =
            "✓ Impact score refreshed from your simulator evaluation.";
    }
}


/* =========================================
   START ALL PAGE FUNCTIONS
   ========================================= */

loadProblem();

loadSolutionLab();

loadSimulator();

loadActionLab();

loadImpactDashboard();