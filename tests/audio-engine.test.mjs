function assert(condition, message) {
  if (!condition) {
    console.error("FAIL:", message);
    process.exitCode = 1;
  } else {
    console.log("PASS:", message);
  }
}

function resolution(sampleRate, fftSize) {
  return sampleRate / fftSize;
}

assert(resolution(44100, 4096) === 44100 / 4096, "Δf = sampleRate / fftSize");
assert(Math.abs(resolution(48000, 2048) - 23.4375) < 0.001, "48kHz / 2048 ≈ 23.44 Hz");
assert(880 === 440 * 2, "BFSK example uses octave relationship");

console.log("\nZionCore basic conceptual tests complete. MWARI NDI MWARI.");
