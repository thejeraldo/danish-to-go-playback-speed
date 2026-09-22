(() => {
    const SPEEDS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    const DEFAULT_SPEED = 1.0;
    const STORAGE_KEY = "danishToGoPlaybackSpeed";

    function createControls(audio) {
        if (audio.dataset.speedControlsAdded === "true") {
            return;
        }

        const player = audio.closest(".audio-player");

        if (!player) {
            return;
        }

        audio.dataset.speedControlsAdded = "true";

        const controls = document.createElement("div");
        controls.className = "danish-audio-speed-controls";

        const label = document.createElement("span");
        label.className = "danish-audio-speed-label";
        label.textContent = "Speed:";

        controls.appendChild(label);

        SPEEDS.forEach(function (speed) {
            const button = document.createElement("button");

            button.type = "button";
            button.className = "danish-audio-speed-button";
            button.textContent = speed + "×";
            button.dataset.speed = String(speed);

            button.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();

                setPlaybackSpeed(
                    audio,
                    speed,
                    controls
                );
            });

            controls.appendChild(button);
        });

        /*
         * Put the controls AFTER the entire .audio-player.
         * Do not put them inside .audio-player because the
         * website controls the layout of that element.
         */
        player.insertAdjacentElement(
            "afterend",
            controls
        );

        setPlaybackSpeed(
            audio,
            getSavedSpeed(),
            controls,
            false
        );

        console.log(
            "[Danish Audio Speed] Added controls:",
            audio
        );
    }

    function setPlaybackSpeed(
        audio,
        speed,
        controls,
        save
    ) {
        if (save === undefined) {
            save = true;
        }

        audio.playbackRate = speed;

        controls
            .querySelectorAll(
                ".danish-audio-speed-button"
            )
            .forEach(function (button) {
                const buttonSpeed = Number(
                    button.dataset.speed
                );

                button.classList.toggle(
                    "selected",
                    buttonSpeed === speed
                );
            });

        if (save) {
            localStorage.setItem(
                STORAGE_KEY,
                String(speed)
            );
        }
    }

    function getSavedSpeed() {
        const saved = Number(
            localStorage.getItem(STORAGE_KEY)
        );

        if (SPEEDS.includes(saved)) {
            return saved;
        }

        return DEFAULT_SPEED;
    }

    function findAudioPlayers() {
        document
            .querySelectorAll("audio.audio-with-progress")
            .forEach(function (audio) {
                createControls(audio);
            });
    }

    findAudioPlayers();

    const observer = new MutationObserver(function () {
        findAudioPlayers();
    });

    observer.observe(
        document.documentElement,
        {
            childList: true,
            subtree: true
        }
    );

    console.log(
        "[Danish Audio Speed] Extension loaded"
    );


})();