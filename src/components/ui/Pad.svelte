<script lang="ts">
  import { activePads } from '../../lib/stores';

  export let index: number = 0;
  export let label: string = '';
  export let sublabel: string = '';
  export let color: string = 'default'; // 'default' | 'accent' | 'red' | 'blue'
  export let onTrigger: (velocity: number) => void = () => {};

  let isPressed = false;
  let pressStartTime = 0;
  let element: HTMLButtonElement;

  // Track if this pad is active (from sequencer playback)
  $: isActive = $activePads.has(index);

  // Calculate velocity based on how hard/fast the pad was pressed
  // For mouse/touch, we simulate velocity with press duration (shorter = harder)
  function calculateVelocity(pressDuration: number): number {
    // Shorter press = higher velocity
    // Range: 50ms (max velocity 127) to 500ms (min velocity 40)
    const minDuration = 50;
    const maxDuration = 500;
    const minVelocity = 40;
    const maxVelocity = 127;
    
    const clampedDuration = Math.max(minDuration, Math.min(maxDuration, pressDuration));
    const normalizedDuration = (clampedDuration - minDuration) / (maxDuration - minDuration);
    
    return Math.round(maxVelocity - normalizedDuration * (maxVelocity - minVelocity));
  }

  function handlePointerDown(event: PointerEvent) {
    event.preventDefault();
    isPressed = true;
    pressStartTime = performance.now();
    element.setPointerCapture(event.pointerId);
  }

  function handlePointerUp(event: PointerEvent) {
    if (!isPressed) return;
    
    event.preventDefault();
    isPressed = false;
    
    const pressDuration = performance.now() - pressStartTime;
    const velocity = calculateVelocity(pressDuration);
    
    onTrigger(velocity);
    element.releasePointerCapture(event.pointerId);
  }

  function handlePointerLeave(event: PointerEvent) {
    if (isPressed) {
      isPressed = false;
      element.releasePointerCapture(event.pointerId);
    }
  }

  // Keyboard support
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      isPressed = true;
      pressStartTime = performance.now();
    }
  }

  function handleKeyUp(event: KeyboardEvent) {
    if ((event.key === ' ' || event.key === 'Enter') && isPressed) {
      event.preventDefault();
      isPressed = false;
      const pressDuration = performance.now() - pressStartTime;
      const velocity = calculateVelocity(pressDuration);
      onTrigger(velocity);
    }
  }

  // Color classes based on prop
  const colorClasses: Record<string, string> = {
    default: 'bg-dr880-pad hover:bg-gray-600',
    accent: 'bg-dr880-accent hover:bg-orange-500',
    red: 'bg-red-700 hover:bg-red-600',
    blue: 'bg-blue-700 hover:bg-blue-600',
  };
</script>

<button
  bind:this={element}
  class="
    relative w-full aspect-square rounded-lg
    {colorClasses[color] || colorClasses.default}
    {isPressed ? 'shadow-pad-pressed scale-95' : 'shadow-pad'}
    {isActive ? 'ring-2 ring-dr880-accent ring-opacity-75' : ''}
    transition-all duration-75
    flex flex-col items-center justify-center
    text-white font-medium
    select-none touch-none
    focus:outline-none focus:ring-2 focus:ring-dr880-accent
  "
  onpointerdown={handlePointerDown}
  onpointerup={handlePointerUp}
  onpointerleave={handlePointerLeave}
  onkeydown={handleKeyDown}
  onkeyup={handleKeyUp}
  tabindex="0"
  role="button"
  aria-label="Pad {index + 1}: {label}"
>
  <!-- Main label -->
  {#if label}
    <span class="text-xs sm:text-sm truncate max-w-full px-1">
      {label}
    </span>
  {/if}
  
  <!-- Sublabel (e.g., note name for bass) -->
  {#if sublabel}
    <span class="text-[10px] sm:text-xs text-gray-400 mt-0.5">
      {sublabel}
    </span>
  {/if}

  <!-- Pad number indicator -->
  <span class="absolute top-1 left-1 text-[8px] text-gray-500">
    {index + 1}
  </span>

  <!-- Active indicator -->
  {#if isActive}
    <span class="absolute inset-0 rounded-lg bg-dr880-accent opacity-30 animate-pulse pointer-events-none"></span>
  {/if}
</button>

<style>
  button {
    -webkit-tap-highlight-color: transparent;
  }
</style>
