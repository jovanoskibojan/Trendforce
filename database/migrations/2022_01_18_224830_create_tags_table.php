<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTagsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('items_id');
            $table->unsignedBigInteger('inbox_id');
            $table->string('title');
            $table->timestamps();

            $table->foreign('items_id')->references('id')->on('items');
            $table->foreign('inbox_id')->references('id')->on('inboxes');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tags');
    }
}
