function assertEqual(a, b) {
    if(a !== b) throw new Error(`${a} !== ${b}`);
}

function testSoundWithKeySignature() {
    const abcs = ["A", "^A", "_A", "^E", "_F", "a", "^a", "_a", "^b", "_c'", "A,", "^A,,", "_A,,,", "^E,", "_F,", "a'", "^a'", "_a''", "^b''", "_c'"]

    // #fromAbcとtoAbcのテスト
    for (const abc of abcs) {
        const sound = new SoundWithKeySignature(abc);
        assertEqual(abc, sound.toAbc());
    }

    // #fromIntとtoIntのテスト
    for (let i = -100; i <= 100; i++) {
        const sound = new SoundWithKeySignature(i);
        assertEqual(i, sound.toInt());
    }

    // 足し算とキーのテスト
    cases = [
        ["A", 1, "^A"],
        ["^C", -1, "C"],
        ["_A", 1, "A"],
        ["^E", 12, "f"],
        ["_G", -12, "^F,"],
        ["a", 24, "a''"],
        ["^a", -24, "^A,"],
        ["^E", 0, "F"],
        ["_f", 0, "e"],
        ["c'", -1, "b"],
        ["a''", 3, "c'''"],
    ]
    for (const item of cases) {
        let a = item[0];
        let b = item[1];
        let c = item[2];
        const sound = new SoundWithKeySignature(a);
        const ans = new SoundWithKeySignature(c)
        assertEqual(sound.add(b).toAbc(), ans.toAbc());
        if(b !== 0) assertEqual(sound.toAbc(b), ans.toAbc());
    }


    console.log('testSoundWithKeySignature ok');
}

function testSound() {
    const abcs = ["A", "E", "F", "a", "b", "c'", "A,", "A,,", "A,,,", "E,", "F,", "a'", "a''", "b''", "c'"]

    // #fromAbcとtoAbcのテスト
    for (const abc of abcs) {
        const sound = new Sound(abc);
        assertEqual(abc, sound.toAbc());
    }

    // #fromIntとtoIntのテスト
    for (let i = -100; i <= 100; i++) {
        const sound = new Sound(i);
        assertEqual(i, sound.toInt());
    }

    // 足し算のテスト
    cases = [
        ["A", 1, "B"],
        ["C", -1, "B,"],
        ["G", 1, "A"],
        ["E", 12, "c'"],
        ["G", -12, "B,,"],
        ["a", 21, "a'''"],
        ["a", -24, "E,,"],
        ["E", 0, "E"],
        ["f", 0, "f"],
        ["c'", -1, "b"],
        ["a''", 3, "d'''"],
    ]
    for (const item of cases) {
        let a = item[0];
        let b = item[1];
        let ans = item[2];
        const sound = new Sound(a);
        assertEqual(sound.add(b).toAbc(), ans);
    }

    // キーのテスト
    cases = [
        ["A", 1, "^A"],
        ["C", -1, "B,"],
        ["G", 1, "^G"],
        ["E", 12, "e"],
        ["G", -12, "G,"],
        ["a", 24, "a''"],
        ["a", -24, "A,"],
        ["E", 0, "E"],
        ["f", 0, "f"],
        ["c'", -1, "b"],
        ["a''", 3, "c'''"],
    ]
    for (const item of cases) {
        let a = item[0];
        let b = item[1];
        let ans = item[2];
        const sound = new Sound(a);
        assertEqual(sound.toAbc(b), ans);
    }

    console.log('testSound ok');
}

testSoundWithKeySignature();
testSound();