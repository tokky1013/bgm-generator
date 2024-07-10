let synthControl = null;

function setAudio(abc, chord, melodicSound=0, tempo=100) {
    if(typeof abc !== "string") abc = abc.toAbc();
    // お気に入り0, 80, 82, 88, 49, 21, 24, 5, 4!!
    let abcString = `
    %%MIDI program ${melodicSound}
    %%staves (1 2)
    V: 1
    X: 1
    M: 4/4
    L: 1/4
    Q: 1/4=${tempo}
    K: C
    ${abc}]
    
    V: 2
    K: C bass
    X: 1
    M: 4/4
    L: 1/4
    ${chord}]
    `;

    // MIDIプレーヤーの準備
    if(synthControl) synthControl.pause();
    synthControl = new ABCJS.synth.SynthController();
    synthControl.load('#play', null, {
        displayLoop: true,
        displayRestart: true,
        displayPlay: true,
        displayProgress: true,
        displayWarp: true
    });

    // 楽譜をレンダリング
    const visualObj = ABCJS.renderAbc('score', abcString);
    $(`#score`).css('display', 'none');
    // $(`#score`).css('overflow-x', 'scroll');
    // $(`#score`).css('width', '100%');

    // MIDIの生成
    const midiBuffer = new ABCJS.synth.CreateSynth();

    midiBuffer.init({visualObj: visualObj[0]}).then(function () {
        // console.log("Synth initialized");
        synthControl.setTune(visualObj[0], false, {}).then(function (response) {
            // console.log("Audio loaded");
            synthControl.play();
        });
    }).catch(function (error) {
        console.error("Error initializing synth", error);
    });
}

function playMelody(key=0) {
    confirmInput();
    const barNum = $('#length').val() - 0;
    const melody = new Melody(null, key);
    const chordProgression = new ChordProgression(
        [new MajorChord('C,,'), new MajorChord('F,,'), new MinorChord('A,,'), new MajorChord('G,,')],
        key
    )

    let melodyAbc = melody.getBar('start');
    let chordAbc = 'z/2|';

    for (let i = 0; i < barNum - 3; i++) {
        melodyAbc += melody.getBar();
        chordAbc += chordProgression.getBar();

        // 転調
        // if(i === 3) {
        //     key = 3;
        //     melody.key = key;
        //     chordProgression.key = key;
        // }
    }
    melodyAbc += melody.getBar('before end') + melody.getBar('end');

    const endingChord = [new MinorChord('D,,').add(key), new MajorChord('G,,').add(key), new MajorChord('C,').add(key)];
    chordAbc += `${endingChord[0].toAbc()} ${endingChord[1].toAbc()} | [${endingChord[2].compositions[0].toAbc()} ${endingChord[2].compositions[2].toAbc()}]|`;

    const melodicSound = $('#melodic-sound').val();
    const tempo = $('#tempo').val();
    setAudio(melodyAbc, chordAbc, melodicSound, tempo);
}

// 入力欄を半角数字にして、範囲外ならデフォルトの値をセット
function confirmInput() {
    const fullnums = '０１２３４５６７８９';
    const reFullnums = new RegExp('['+fullnums+']','g');
    const toHalfnums = text => text.replace(reFullnums, m=>fullnums.indexOf(m));

    let tempo = toHalfnums($('#tempo').val()).replace(/[^0-9]/g, '') - 0;
    if(tempo <= 0) tempo = 100;

    $('#tempo').val(tempo);

    let length = toHalfnums($('#length').val()).replace(/[^0-9]/g, '') - 0;
    if(length < 3) length = 3;

    $('#length').val(length);
}

$(document).ready(function(){
    $('#tempo').on('click', function() {
        $(this).select();
    });

    $('#tempo').blur(confirmInput);

    $('#length').on('click', function() {
        $(this).select();
    });

    $('#length').blur(confirmInput);
});