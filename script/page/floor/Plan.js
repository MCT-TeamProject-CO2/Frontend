export default class Plan {
    constructor(app) {

    }

    domLookup() {
        // find elements
        var svg = document.querySelector(".js-floorplan"),
            pivot = document.querySelector(".js-pivot"),
            proxy = document.createElement("div");

        svg.addEventListener('mouseover', this.onMouseOver.bind(this));
        svg.addEventListener('mouseout', this.onMouseOut.bind(this));

        // create svg points
        var point = svg.createSVGPoint();
        var startClient = svg.createSVGPoint();
        var startGlobal = svg.createSVGPoint();

        var viewBox = svg.viewBox.baseVal;

        var zoom = {
            animation: new TimelineLite(),
            scaleFactor: 1.6,
            duration: 0.5,
            ease: Power2.easeOut,
        };

        var resetAnimation = new TimelineLite();
        var pivotAnimation = TweenLite.to(pivot, 0.1, {
            alpha: 1,
            scale: 1,
            paused: true,
        });

        var pannable = new Draggable(proxy, {
            throwResistance: 3000,
            trigger: svg,
            throwProps: true,
            onPress: selectDraggable,
            onDrag: updateViewBox,
            onThrowUpdate: updateViewBox,
        });

        svg.addEventListener("wheel", (event) => {
            // makes sure the page doesn't try to reset itself
            event.preventDefault();
    
            // create variables
            var normalized;
            var delta = event.wheelDelta;
    
            // calculate scale value
            if (delta) {
                normalized = delta % 120 == 0 ? delta / 120 : delta / 12;
            } else {
                delta = event.deltaY || event.detail || 0;
                normalized = -(delta % 3 ? delta * 10 : delta / 3);
            }
            var scaleDelta =
                normalized > 0 ? 1 / zoom.scaleFactor : zoom.scaleFactor;
    
            // update point values
            point.x = event.clientX;
            point.y = event.clientY;
    
            var startPoint = point.matrixTransform(svg.getScreenCTM().inverse());
    
            var fromVars = {
                ease: zoom.ease,
                x: viewBox.x,
                y: viewBox.y,
                width: viewBox.width,
                height: viewBox.height,
            };
    
            // update viewbox
            viewBox.x -= (startPoint.x - viewBox.x) * (scaleDelta - 1);
            viewBox.y -= (startPoint.y - viewBox.y) * (scaleDelta - 1);
            viewBox.width *= scaleDelta;
            viewBox.height *= scaleDelta;
    
            zoom.animation = TweenLite.from(viewBox, zoom.duration, fromVars);
        });
    
        // SELECT DRAGGABLE
        // ===========================================================================
        function selectDraggable(event) {
            if (resetAnimation.isActive()) {
                resetAnimation.kill();
            }
    
            // update startclient values to current mouse position
            startClient.x = this.pointerX;
            startClient.y = this.pointerY;
            startGlobal = startClient.matrixTransform(
                svg.getScreenCTM().inverse()
            );
    
            // Left mouse button
            if (event.button === 0) {
                TweenLite.set(proxy, {
                    x: this.pointerX,
                    y: this.pointerY,
                });
    
                pannable.enable().update().startDrag(event);
                pivotAnimation.reverse();
            }
        }
    
        // UPDATE VIEWBOX
        // ===========================================================================
        function updateViewBox() {
            if (zoom.animation.isActive()) {
                return;
            }
    
            point.x = this.x;
            point.y = this.y;
    
            var moveGlobal = point.matrixTransform(svg.getScreenCTM().inverse());
    
            // move to current position
    
            let deltaX = moveGlobal.x - startGlobal.x;
            let deltaY = moveGlobal.y - startGlobal.y;
    
            viewBox.x -= deltaX;
            viewBox.y -= deltaY;
        }
    
        const rooms = document.querySelectorAll(".js-room");
        const floorplan = document.querySelector(".js-floorplan");
    
        for (const room of rooms) {
            room.addEventListener("mouseover", () => {
                resetHighlight();
                showRoom(room.dataset.room);
            });

            setFill(room.dataset.room);
    
            room.addEventListener("click", () => { centerOnRoom(room.dataset.room); });
        }
    
        function setFill(roomName) {
            const room = floorplan.querySelector(`svg [data-room = "${roomName}"]`);
            room.style.fill = 'var(--global-color-blue-howest)';
            room.style.fillOpacity = 0;
        }

        //move to room on click
        function centerOnRoom(roomName) {
            const room = floorplan.querySelector(`[data-room = "${roomName}"]`);
    
            let movX = room.x.baseVal.value - viewBox.width / 2 + room.width.baseVal.value / 2;
            let movY = room.y.baseVal.value - viewBox.height / 2 + room.height.baseVal.value / 2;
    
            viewBox.x = movX;
            viewBox.y = movY;
        }
    
        // highlight room on map
        function showRoom(roomName) {
            resetHighlight();
            const room = floorplan.querySelector(`svg [data-room = "${roomName}"]`);
            room.classList.add("room-hover");
            room.style.fillOpacity = 0.5;
        }
    }

    onMouseOut(e) {
        // get target
        e = e || window.event;
        var target = e.target;

        // check if target has the room data attribute
        if (target.dataset.hasOwnProperty("room")) {
            // get all elements who have the room data attribute with the current value
            var room = target.dataset.room;
            var result = document.querySelectorAll(`[data-room = "${room}"]`);

            // remove the css class from all elements
            for (let i = 0; i < result.length; i++) {
                result[i].classList.remove("highlighted");
            }
        }
    }

    onMouseOver(e) {
        // get target
        e = e || window.event;
        var target = e.target;

        // check if target has the room data attribute
        if (target.dataset.hasOwnProperty("room")) {
            // get all elements who have the room data attribute with the current value
            var room = target.dataset.room;
            var result = document.querySelectorAll(`[data-room = "${room}"]`);
            target.style.cursor = "pointer";
            resetHighlight();
            target.classList.add("room-hover");
            target.style.fillOpacity = 0.1;

            // add the css class to all elements
            var i;
            for (i = 0; i < result.length; i++) {
                result[i].classList.add("highlighted");

                // scroll when hover over plan not card
                if (target.parentElement.nodeName == "svg" && result[i].parentElement.nodeName != "svg") {
                    result[i].scrollIntoView();
                }
            }
        }
    }

    run() {
        this.domLookup();
    }
}

function resetHighlight() {
    const floorplan = document.querySelector(".js-floorplan");
    const room = floorplan.querySelector(".room-hover");
    if (room) {
        room.style.fillOpacity = 0;
        room.classList.remove("room-hover");
    }
}