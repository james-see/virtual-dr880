<script lang="ts">
  import { 
    currentPattern, 
    currentKit, 
    tempo, 
    isPlaying,
    currentMeasure,
    currentBeat,
    currentPadBank
  } from '../../lib/stores';

  // Format pad bank for display
  function formatPadBank(bank: string): string {
    switch (bank) {
      case 'DRUM1': return 'DRUM 1';
      case 'DRUM2': return 'DRUM 2';
      case 'DRUM3': return 'DRUM 3';
      case 'BASS': return 'BASS';
      case 'BASS_LOW': return 'BASS -1';
      case 'BASS_HIGH': return 'BASS +1';
      default: return bank;
    }
  }
</script>

<div class="bg-dr880-lcd-bg rounded-lg p-4 font-lcd border-4 border-gray-700 shadow-inner">
  <!-- Top Row: Mode and Pattern -->
  <div class="flex justify-between items-center mb-2">
    <span class="text-dr880-lcd-text text-xs">PATTERN</span>
    <span class="text-dr880-lcd-text text-xs">
      {$isPlaying ? '▶ PLAY' : '■ STOP'}
    </span>
  </div>

  <!-- Pattern Name -->
  <div class="text-dr880-lcd-text text-lg font-bold mb-3 truncate">
    {$currentPattern?.name || '-- NO PATTERN --'}
  </div>

  <!-- Middle Row: Position and Tempo -->
  <div class="grid grid-cols-2 gap-4 mb-3">
    <div>
      <span class="text-dr880-lcd-text text-xs block">POSITION</span>
      <span class="text-dr880-lcd-text text-xl font-bold">
        {$currentMeasure}:{$currentBeat}
      </span>
    </div>
    <div>
      <span class="text-dr880-lcd-text text-xs block">TEMPO</span>
      <span class="text-dr880-lcd-text text-xl font-bold">
        {$tempo}
      </span>
    </div>
  </div>

  <!-- Bottom Row: Kit and Pad Bank -->
  <div class="flex justify-between items-center pt-2 border-t border-dr880-lcd-text/30">
    <div>
      <span class="text-dr880-lcd-text text-xs block">KIT</span>
      <span class="text-dr880-lcd-text text-sm">
        {$currentKit?.name || '--'}
      </span>
    </div>
    <div class="text-right">
      <span class="text-dr880-lcd-text text-xs block">PAD BANK</span>
      <span class="text-dr880-lcd-text text-sm">
        {formatPadBank($currentPadBank)}
      </span>
    </div>
  </div>
</div>
