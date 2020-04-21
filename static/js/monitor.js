let countdown;

function setOffline(data) {
    const title = document.getElementById('title');
    const timer = document.getElementById('timer');

    title.innerHTML = data.toUpperCase();
    timer.innerHTML = '';
    changeBackground('white-background');
}

function setScene(data) {
    console.log(data)
    const title = document.getElementById('title');
    const timer = document.getElementById('timer');

    let seconds;
    let dirrection;

    if (data.status === 'offline') {
        clearInterval(countdown);
        title.innerText = data.status.toUpperCase();
        timer.innerText = '';
        changeBackground('white-background');
    } 
    else if (data.status === 'preacher') {
        clearInterval(countdown);
        dirrection = 'desc';
        title.innerText = data.status.toUpperCase();
        seconds = Number(data.minutes) * 60;

        countdown = setInterval(function () {
            let clockMinutes = Math.floor(Number(seconds) / 60);
            let clockSeconds = Number(seconds) % 60;
            let clockZero = clockSeconds < 10 ? '0' : '';
            timer.innerText = `${clockMinutes}:${clockZero}${clockSeconds}`;

            if (seconds === 0) {
                dirrection = 'asc';
                timer.classList.add('red-text');
            }

            if (dirrection === 'desc') {
                seconds = seconds - 1;
            } else if (dirrection === 'asc') {
                seconds = seconds + 1;
            }
            
        }, 1000);
        changeBackground('black-background');
    }
}

function changeBackground(backgroundName) {
    const timerContainer = document.getElementById('timer-container');
    const titleContainer = document.getElementById('title-container');

    timerContainer.className = backgroundName;
    titleContainer.className = backgroundName;
}