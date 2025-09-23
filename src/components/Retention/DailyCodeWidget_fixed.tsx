                      {/* Streak atual - Simplificado */}
                      {streakStatus && streakStatus.streak_count > 0 && (
                        <div className="flex justify-center pt-3 border-t border-gray-100">
                          <StreakDisplay 
                            streak={streakStatus.streak_count} 
                            animated={streakAnimated}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Estatísticas */}
                  <div className="p-5 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                        <div className="text-xl font-bold text-green-600">
                          {coins.totalEarned.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600 font-medium">Total Ganho</div>
                      </div>
                      <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                        <div className="text-xl font-bold text-blue-600">
                          {coins.totalSpent.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600 font-medium">Total Gasto</div>
                      </div>
                    </div>
                    
                    {/* Botão Ver Tudo */}
                    <div className="mt-4">
                      <button 
                        onClick={() => {
                          closeModal();
                          navigate('/coins');
                        }}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg"
                      >
                        <Gift className="w-4 h-4" />
                        Ver Tudo & Recompensas
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </UTICoinsConditional>
    );
  };
