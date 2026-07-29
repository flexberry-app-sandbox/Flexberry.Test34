namespace Test.ApplicationLayer.Mapping
{
    using System;
    using Test;
    using Test.ApplicationLayer.DTO.AggregationClass;

    /// <summary>
    /// Статический маппер для преобразования между сущностью <see cref="AggregationClass"/> и её DTO.
    /// </summary>
    public static class AggregationClassMapper
    {
        /// <summary>
        /// Преобразует <see cref="AggregationClass"/> в указанный DTO.
        /// </summary>
        /// <typeparam name="TDto">Тип DTO.</typeparam>
        /// <param name="source">Исходная сущность.</param>
        /// <returns>Указанный DTO.</returns>
        public static TDto MapToDto<TDto>(this AggregationClass source)
            where TDto : AggregationClassDtoBase, new()
        {
            if (source == null)
            {
                throw new ArgumentNullException(nameof(source));
            }

            TDto result = new TDto();

            return (TDto)result.FillFromClass(source);
        }

        /// <summary>
        /// Обновляет поля сущности <see cref="AggregationClass"/> по данным из DTO.
        /// </summary>
        /// <typeparam name="TDto">Тип DTO.</typeparam>
        /// <param name="destination">Сущность, которую нужно обновить.</param>
        /// <param name="source">DTO с новыми значениями.</param>
        public static void UpdateFromDto<TDto>(this AggregationClass destination, TDto source)
            where TDto : AggregationClassDtoBase
        {
            if (source == null)
            {
                throw new ArgumentNullException(nameof(source));
            }

            if (destination == null)
            {
                throw new ArgumentNullException(nameof(destination));
            }

            source.UpdateFromDto(destination);
        }
    }
}
