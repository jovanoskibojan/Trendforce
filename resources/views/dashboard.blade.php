<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="container-fluid" style="padding: 0;">
        <div id="folderTree"></div>
    </div>
</x-app-layout>
